using System.Collections;
using System.Collections.Generic;
using Genesis.Atlas;
using Genesis.Core;
using Genesis.Data;
using Genesis.Effects;
using Genesis.UI;
using UnityEngine;

namespace Genesis.Theater
{
    /// <summary>
    /// Full theater play loop: load theater → hotspot / order → timer → EXECUTE → resolve → all beats → Results.
    /// Freemium / RevenueCat remain stubbed (do not block Editor play-through).
    /// </summary>
    public class TheaterSession : MonoBehaviour
    {
        public static TheaterSession Instance { get; private set; }

        [Header("Wired refs")]
        public TheaterBoardBuilder boardBuilder;
        public TheaterCameraRig cameraRig;
        public OpsHudController hud;
        public OrderRailController orderRail;
        public WorldReactionFX worldFx;
        public ResolveBeatController resolveBeat;
        public FreemiumStub freemium;

        [Header("Slice")]
        public string theaterIdOverride = "";
        public float orderSeconds = 45f;

        TheaterBundle _bundle;
        int _beatIndex;
        OrderChoice _selectedOrder;
        HotspotMarker _selectedHotspot;
        bool _awaitingExecute;
        bool _resolving;
        readonly List<string> _executedCallsigns = new();
        readonly List<RunScoreUtility.ExecutedOrder> _executedOrders = new();
        readonly List<string> _scarLines = new();

        public TheaterBundle Bundle => _bundle;
        public BeatData CurrentBeat =>
            _bundle?.scenario?.beats != null &&
            _beatIndex >= 0 &&
            _beatIndex < _bundle.scenario.beats.Count
                ? _bundle.scenario.beats[_beatIndex]
                : null;

        void Awake()
        {
            Instance = this;
        }

        void OnDestroy()
        {
            if (Instance == this) Instance = null;
        }

        void OnApplicationPause(bool pauseStatus)
        {
            if (pauseStatus)
            {
                SaveActiveProgress();
                GenesisAudio.Ensure().PauseAmbience();
            }
            else
            {
                GenesisAudio.Ensure().ResumeAmbience();
            }
        }

        void OnApplicationFocus(bool hasFocus)
        {
            if (!hasFocus)
            {
                SaveActiveProgress();
                GenesisAudio.Ensure().PauseAmbience();
            }
            else
            {
                GenesisAudio.Ensure().ResumeAmbience();
            }
        }

        void OnApplicationQuit()
        {
            SaveActiveProgress();
            GenesisAudio.Ensure().StopAmbience();
        }

        public void SaveActiveProgress()
        {
            if (_bundle?.scenario == null) return;
            int total = _bundle.scenario.beats?.Count ?? 0;
            if (total == 0 || _beatIndex >= total) return;
            var id = _bundle.scenario.id ?? ResolveTheaterId();
            var title = _bundle.scenario.title ?? "THEATER";
            AppFlow.SaveActiveRun(id, title, _beatIndex, total, _executedCallsigns, _executedOrders, _scarLines);
            Debug.Log($"[Genesis] Auto-saved active run for '{id}' at phase {_beatIndex + 1}/{total}.");
        }

        void Start()
        {
            freemium ??= GetComponent<FreemiumStub>() ?? gameObject.AddComponent<FreemiumStub>();
            GenesisAudio.Ensure().StartAmbience();
            BeginSlice();
        }

        public void BeginSlice()
        {
            if (boardBuilder == null)
            {
                Debug.LogError("[Genesis] TheaterSession missing boardBuilder — run Rebuild Theater Play Slice.");
                return;
            }

            var id = ResolveTheaterId();
            try
            {
                _bundle = TheaterCatalogLoader.LoadTheater(id);
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"[Genesis] Failed to load theater '{id}': {ex.Message}");
                return;
            }

            if (_bundle?.board == null || _bundle.scenario == null)
            {
                Debug.LogError($"[Genesis] Theater '{id}' missing board/scenario.");
                return;
            }

            _beatIndex = 0;
            _executedCallsigns.Clear();
            _executedOrders.Clear();
            _scarLines.Clear();

            // Resume active run if requested and matching
            if (AppFlow.IsResumingRun)
            {
                var active = AppFlow.GetActiveRunData();
                if (active != null && active.theaterId == id)
                {
                    int maxBeats = _bundle?.scenario?.beats?.Count ?? 1;
                    _beatIndex = Mathf.Clamp(active.beatIndex, 0, maxBeats - 1);
                    if (active.executedCallsigns != null) _executedCallsigns.AddRange(active.executedCallsigns);
                    if (active.scarLines != null) _scarLines.AddRange(active.scarLines);
                    for (int i = 0; i < active.orderCallsigns.Count; i++)
                    {
                        _executedOrders.Add(new RunScoreUtility.ExecutedOrder
                        {
                            callsign = active.orderCallsigns[i],
                            kind = i < active.orderKinds.Count ? active.orderKinds[i] : "",
                            detail = i < active.orderDetails.Count ? active.orderDetails[i] : ""
                        });
                    }
                    Debug.Log($"[Genesis] Resumed theater '{id}' at phase {_beatIndex + 1}/{maxBeats}.");
                }
            }

            boardBuilder.TheaterId = _bundle.scenario.id;
            boardBuilder.Build(_bundle.board);
            cameraRig?.FrameBoard(boardBuilder);
            hud?.BindTheater(_bundle);
            EnterBeat();
        }

        public void AbortMission()
        {
            var id = _bundle?.scenario?.id ?? ResolveTheaterId();
            var title = _bundle?.scenario?.title ?? "THEATER";
            var total = _bundle?.scenario?.beats?.Count ?? 0;
            AppFlow.SaveActiveRun(id, title, _beatIndex, total, _executedCallsigns, _executedOrders, _scarLines);
            GenesisAudio.Ensure().StopAmbience();
            AppFlow.GoTheaterSelect();
        }

        string ResolveTheaterId()
        {
            // Prefer shell-selected theater when this Play was started via BeginTheater.
            if (AppFlow.CurrentPlayFromShell)
            {
                var selected = AppFlow.SelectedTheaterId;
                if (!string.IsNullOrEmpty(selected)) return selected;
            }

            if (!string.IsNullOrEmpty(theaterIdOverride)) return theaterIdOverride;
            return TheaterCatalogLoader.LoadCatalog().sliceTheaterId;
        }

        public void EnterBeat()
        {
            _resolving = false;
            _awaitingExecute = false;
            _selectedOrder = null;
            _selectedHotspot = null;
            boardBuilder?.SetSelectedMarker(null);
            ClearSelectionLink();
            var beat = CurrentBeat;
            if (beat == null)
            {
                FinishTheater();
                return;
            }

            var total = _bundle?.scenario?.beats?.Count ?? 1;
            hud?.ShowBeat(beat, _beatIndex, total, orderSeconds);
            orderRail?.ShowOrders(beat.choices, OnOrderSelected);
            cameraRig?.ResetFocus();
        }

        public void OnHotspotTapped(HotspotMarker hotspot)
        {
            if (_resolving || CurrentBeat == null || hotspot?.Marker == null) return;
            _selectedHotspot = hotspot;
            boardBuilder?.SetSelectedMarker(hotspot.Marker.id);
            cameraRig?.FocusWorld(hotspot.transform.position);
            hud?.SetFocusLabel(hotspot.Marker.label ?? "MARKER");
            MobilePlatform.HapticTick();
            GenesisAudio.Ensure().PlaySelect();
            hud?.ShowIntelChip(hotspot.Marker.label ?? hotspot.Marker.id ?? "");

            var match = CurrentBeat.choices?.Find(c => c.markerId == hotspot.Marker.id);
            if (match != null)
            {
                OnOrderSelected(match);
            }
        }

        public void OnOrderSelected(OrderChoice order)
        {
            if (_resolving || order == null) return;
            _selectedOrder = order;
            _awaitingExecute = true;
            if (!string.IsNullOrEmpty(order.markerId) && boardBuilder != null)
            {
                boardBuilder.SetSelectedMarker(order.markerId);
                if (boardBuilder.Hotspots != null &&
                    boardBuilder.Hotspots.TryGetValue(order.markerId, out var hs) &&
                    hs != null)
                {
                    cameraRig?.FocusWorld(hs.transform.position);
                    _selectedHotspot = hs;
                }
            }

            var year = _bundle?.scenario?.year ?? 0;
            var theaterId = _bundle?.scenario?.id ?? "";
            hud?.ShowIntelChip(order.label ?? "");
            orderRail?.SetSelected(order.id);
            hud?.ArmExecute(order);
            RefreshSelectionLink(order, _selectedHotspot);
        }

        public void OnExecutePressed()
        {
            if (!_awaitingExecute || _selectedOrder == null || _resolving) return;
            StartCoroutine(ExecuteSequence(_selectedOrder));
        }

        public void OnTimerExpired()
        {
            if (_resolving) return;
            if (_selectedOrder == null && CurrentBeat?.choices is { Count: > 0 })
            {
                OnOrderSelected(CurrentBeat.choices[0]);
            }

            if (_selectedOrder != null)
            {
                OnExecutePressed();
            }
        }

        IEnumerator ExecuteSequence(OrderChoice order)
        {
            _resolving = true;
            _awaitingExecute = false;
            ClearSelectionLink();
            hud?.LockExecute();
            orderRail?.Lock();

            var callsign = string.IsNullOrEmpty(order?.DisplayCallsign) ? "ORDER" : order.DisplayCallsign;
            _executedCallsigns.Add(callsign);
            var logged = new RunScoreUtility.ExecutedOrder
            {
                callsign = callsign,
                kind = order?.kind ?? "",
                detail = order?.detail ?? ""
            };
            if (order?.effects != null)
            {
                foreach (var fx in order.effects)
                {
                    if (fx != null) logged.effects.Add(fx);
                }
            }

            _executedOrders.Add(logged);

            var verb = WorldVerbResolver.FromOrder(order);
            var scarLine = ScarLineFor(verb, order);
            if (!string.IsNullOrEmpty(scarLine)) _scarLines.Add(scarLine);
            GenesisAudio.Ensure().PlayExecuteStinger(verb);
            hud?.ShowCommitBeat(ScarVerbLabel(verb));

            if (worldFx != null)
            {
                yield return worldFx.PlayExecute(order, boardBuilder, cameraRig);
            }
            else
            {
                yield return new WaitForSeconds(0.6f);
            }

            var summary = BuildResolveSummary(order);
            if (resolveBeat == null)
            {
                _beatIndex++;
                EnterBeat();
                yield break;
            }

            resolveBeat.Show(summary, () =>
            {
                _beatIndex++;
                var beatCount = _bundle?.scenario?.beats?.Count ?? 0;
                if (beatCount <= 0 || _beatIndex >= beatCount)
                {
                    FinishTheater();
                    return;
                }

                var tid = _bundle?.scenario?.id ?? ResolveTheaterId();
                var ttitle = _bundle?.scenario?.title ?? "THEATER";
                AppFlow.SaveActiveRun(tid, ttitle, _beatIndex, beatCount, _executedCallsigns, _executedOrders, _scarLines);

                EnterBeat();
            });
        }

        void FinishTheater()
        {
            AppFlow.ClearActiveRun();
            var title = _bundle?.scenario?.title ?? "THEATER";
            GenesisAudio.Ensure().StopAmbience();
            MobilePlatform.HapticConfirm();
            hud?.ShowMissionComplete(title);
            orderRail?.Hide();

            var total = _bundle?.scenario?.beats?.Count ?? 0;
            var theaterId = _bundle?.scenario?.id ?? AppFlow.SelectedTheaterId;
            var year = _bundle?.scenario?.year ?? 0;
            var scored = RunScoreUtility.Compute(theaterId, title, year, _executedOrders);
            var summary = new RunSummary
            {
                theaterId = theaterId,
                theaterTitle = title,
                year = year,
                phasesCompleted = Mathf.Min(_beatIndex, total),
                phasesTotal = total,
                closingLine = BuildClosingLine(scored),
                score = scored.score,
                grade = scored.grade,
                pathFamily = scored.pathFamily,
                headline = scored.headline,
                netPolarity = scored.netPolarity,
                challengeText = scored.challengeText,
                shareText = scored.shareText,
                topGainLine = scored.topGain != null
                    ? $"▲ {scored.topGain.tag.Replace('_', ' ')} +{scored.topGain.weight}"
                    : "▲ no clear gain",
                topCostLine = scored.topCost != null
                    ? $"▼ {scored.topCost.tag.Replace('_', ' ')} {scored.topCost.weight}"
                    : "▼ no hard cost"
            };
            summary.ordersExecuted.AddRange(_executedCallsigns);
            summary.scarLines.AddRange(_scarLines);

            // Brief mission-complete celebration beat then transition to Results scene
            StartCoroutine(GoResultsAfterDelay(summary, 1.2f));
        }

        IEnumerator GoResultsAfterDelay(RunSummary summary, float delay)
        {
            yield return new WaitForSeconds(delay);
            AppFlow.CompleteTheater(summary);
        }

        string BuildClosingLine(RunScoreUtility.Result scored)
        {
            if (_executedCallsigns.Count == 0)
                return "Desk cleared without a committed order.";
            var grade = scored != null ? scored.grade : "—";
            var score = scored != null ? scored.score : 0;
            return $"Cabinet {score} ({grade}) · world course locked — challenge a rival.";
        }

        static string ScarVerbLabel(WorldVerb verb) => verb switch
        {
            WorldVerb.BorderShift => "COMMIT · BORDER INK",
            WorldVerb.CorridorToggle => "COMMIT · CORRIDOR GATE",
            WorldVerb.ControlWash => "COMMIT · CONTROL WASH",
            WorldVerb.CityStress => "COMMIT · CITY STRESS",
            _ => "COMMIT · MAP FIRST"
        };

        static string ScarLineFor(WorldVerb verb, OrderChoice order)
        {
            var call = string.IsNullOrEmpty(order?.DisplayCallsign) ? "ORDER" : order.DisplayCallsign;
            return verb switch
            {
                WorldVerb.BorderShift => $"Border ink · {call}",
                WorldVerb.CorridorToggle => $"Corridor gate · {call}",
                WorldVerb.ControlWash => $"Control wash · {call}",
                WorldVerb.CityStress => $"City stress · {call}",
                _ => null
            };
        }

        // ── Selection link helpers ────────────────────────────────────────────────
        // #E8A33D amber — thin, calm line from the bottom-edge of the map to the selected pin.

        static readonly Color SelectionLinkAmber = new(0.910f, 0.639f, 0.239f, 0.80f);

        /// <summary>
        /// Draws (or refreshes) the thin amber line on the map from the board's bottom-center
        /// edge to the target pin's world position.  A pin world position is always required;
        /// falls back to the currently selected hotspot when the order has no markerId.
        /// </summary>
        void RefreshSelectionLink(OrderChoice order, HotspotMarker hotspot)
        {
            if (worldFx == null || boardBuilder == null) return;

            // Resolve the target pin's world position.
            Vector3 pinWorld;
            if (hotspot != null)
            {
                pinWorld = hotspot.transform.position;
            }
            else if (!string.IsNullOrEmpty(order?.markerId) &&
                     boardBuilder.Hotspots != null &&
                     boardBuilder.Hotspots.TryGetValue(order.markerId, out var hs) &&
                     hs != null)
            {
                pinWorld = hs.transform.position;
            }
            else
            {
                ClearSelectionLink();
                return;
            }

            // Acquire (or reuse) the MapStoryFX on the board.
            var mapFx = worldFx.AcquireMapFx(boardBuilder);
            if (mapFx == null) return;

            // Bottom-center of the map board in world space — the edge nearest the camera /
            // bottom sheet.  boardDepth is along the Z axis of MapRoot's local space.
            var localEdge = new Vector3(0f, 0f, boardBuilder.boardDepth * 0.5f);
            var fromWorld = boardBuilder.MapRoot != null
                ? boardBuilder.MapRoot.TransformPoint(localEdge)
                : localEdge;

            mapFx.DrawSelectionLink(fromWorld, pinWorld, SelectionLinkAmber);
        }

        /// <summary>Hides the selection link without touching any other map FX.</summary>
        void ClearSelectionLink()
        {
            if (boardBuilder?.MapRoot == null) return;
            var root  = boardBuilder.MapRoot;
            var mapFx = root.GetComponent<MapStoryFX>()
                        ?? root.GetComponentInChildren<MapStoryFX>();
            mapFx?.ClearSelectionLink();
        }

        ResolvePayload BuildResolveSummary(OrderChoice order)
        {
            string narrative = !string.IsNullOrEmpty(order?.detail) ? order.detail : order?.label;
            if (string.IsNullOrEmpty(narrative)) narrative = "Directive committed by war cabinet.";

            string effectSummary = "";
            if (order?.effects != null && order.effects.Count > 0)
            {
                foreach (var fx in order.effects)
                {
                    if (fx == null) continue;
                    string sign = fx.weight > 0 ? "+" : "";
                    string tagClean = (fx.tag ?? "impact").Replace('_', ' ').ToUpperInvariant();
                    string fxText = !string.IsNullOrEmpty(fx.summary) && !fx.summary.Equals(fx.tag, System.StringComparison.OrdinalIgnoreCase)
                        ? fx.summary
                        : $"{tagClean} {sign}{fx.weight}";
                    effectSummary += (string.IsNullOrEmpty(effectSummary) ? "" : "  ·  ") + fxText;
                }
            }

            var theaterTitle = _bundle?.scenario?.title ?? "Genesis";
            var year = _bundle?.scenario?.year ?? 0;
            var live = RunScoreUtility.Compute(
                _bundle?.scenario?.id ?? "",
                theaterTitle,
                year,
                _executedOrders);
            var verb = WorldVerbResolver.FromOrder(order);
            var verbLine = verb switch
            {
                WorldVerb.BorderShift => "Border ink shifts on the war desk.",
                WorldVerb.CorridorToggle => "Corridor gate flips on the board.",
                WorldVerb.ControlWash => "Control wash settles on the landmass.",
                WorldVerb.CityStress => "City stress marks the tactical sector.",
                _ => "Course locked on the operations board."
            };

            string body = narrative;
            if (!string.IsNullOrEmpty(effectSummary)) body += $"\n\nSTRATEGIC EFFECT // {effectSummary}";
            body += $"\nMAP REACTION // {verbLine}";

            return new ResolvePayload
            {
                theaterTitle = theaterTitle,
                orderCallsign = string.IsNullOrEmpty(order?.DisplayCallsign) ? "ORDER" : order.DisplayCallsign,
                courseLine = body,
                challengeLine =
                    $"WORLD COURSE LOCKED — challenge a rival to beat your {theaterTitle} desk · live {live.score} ({live.grade}).",
                shareText = live.shareText,
                viralHook = true
            };
        }
    }

    public class FreemiumStub : MonoBehaviour
    {
        public bool IsPro => false;

        public int FreeTheatersRemaining => 2;

        static readonly HashSet<string> FreeIds = new()
        {
            "hist-1947-radcliffe",
            "hist-1962-cuba"
        };

        /// <summary>
        /// Unity Editor play-through never hard-blocks. Paywall is stubbed so Bilal can test all theaters.
        /// Catalog still marks free desks for UI chrome.
        /// </summary>
        public bool CanDeploy(string theaterId) => true;

        public bool IsFreeDesk(string theaterId) =>
            !string.IsNullOrEmpty(theaterId) && FreeIds.Contains(theaterId);

        public void ShowPaywallStub()
        {
            Debug.Log("[Genesis] Freemium/RevenueCat stub — paywall deferred (Unity does not block Deploy).");
        }
    }
}
