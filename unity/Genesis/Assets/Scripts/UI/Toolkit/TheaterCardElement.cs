using System;
using Genesis.Data;
using Genesis.Monetization;
using Genesis.Theater;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Atlas theater card — thumbnail, meta, FREE/locked state, and play/unlock CTA.
    /// </summary>
    public sealed class TheaterCardElement : VisualElement
    {
        public const string UnlockCtaLabel = "UNLOCK $5";
        public const string PlayCtaLabel = "PLAY THEATER →";

        public TheaterSelectionEntry Entry { get; }
        public string LaunchId => Entry?.launchId;
        public bool IsLocked { get; private set; }

        readonly Label _ctaLabel;
        readonly Button _cta;

        public TheaterCardElement(
            TheaterSelectionEntry entry,
            int number,
            bool locked,
            Action<string> onSelect,
            Action<string, bool> onCta)
        {
            Entry = entry ?? throw new ArgumentNullException(nameof(entry));
            IsLocked = locked;

            AddToClassList("theater-card");
            userData = entry.launchId;
            if (locked)
                AddToClassList("theater-card--locked");

            var thumb = new VisualElement();
            thumb.AddToClassList("theater-card__thumb");
            thumb.pickingMode = PickingMode.Ignore;
            LoadThumbnail(thumb, entry);
            Add(thumb);

            var num = new Label { text = number.ToString("00") };
            num.AddToClassList("theater-card__num");
            num.pickingMode = PickingMode.Ignore;
            thumb.Add(num);

            if (locked)
            {
                var lockIcon = new VisualElement();
                lockIcon.AddToClassList("theater-card__lock-icon");
                lockIcon.pickingMode = PickingMode.Ignore;
                var lockLbl = new Label { text = "▣" };
                lockLbl.pickingMode = PickingMode.Ignore;
                lockIcon.Add(lockLbl);
                thumb.Add(lockIcon);
            }
            else if (entry.free)
            {
                var access = TheaterAccessService.Instance;
                if (access == null || !access.IsFullGameUnlocked)
                {
                    var freeBadge = new Label { text = "FREE" };
                    freeBadge.AddToClassList("theater-card__badge");
                    freeBadge.AddToClassList("theater-card__badge--free");
                    freeBadge.pickingMode = PickingMode.Ignore;
                    thumb.Add(freeBadge);
                }
            }

            var body = new VisualElement();
            body.AddToClassList("theater-card__body");
            body.pickingMode = PickingMode.Ignore;

            var title = new Label { text = (entry.displayTitle ?? "Untitled").ToUpperInvariant() };
            title.AddToClassList("theater-card__title");
            title.pickingMode = PickingMode.Ignore;
            body.Add(title);

            var premise = new Label { text = entry.description ?? "" };
            premise.AddToClassList("theater-card__premise");
            premise.pickingMode = PickingMode.Ignore;
            body.Add(premise);

            var footer = new VisualElement();
            footer.AddToClassList("theater-card__footer");
            footer.pickingMode = PickingMode.Ignore;

            var region = new Label { text = ShortRegion(entry.region) };
            region.AddToClassList("theater-card__region");
            region.pickingMode = PickingMode.Ignore;
            footer.Add(region);

            var diff = new Label { text = entry.difficulty ?? "Medium" };
            diff.AddToClassList("theater-card__diff");
            diff.pickingMode = PickingMode.Ignore;
            footer.Add(diff);
            body.Add(footer);

            _cta = new Button();
            _cta.AddToClassList("theater-card__cta");
            if (locked)
            {
                _cta.AddToClassList("theater-card__cta--lock");
                _ctaLabel = new Label { text = UnlockCtaLabel };
            }
            else
            {
                _cta.AddToClassList("theater-card__cta--play");
                _ctaLabel = new Label { text = PlayCtaLabel };
            }

            _ctaLabel.pickingMode = PickingMode.Ignore;
            _cta.Add(_ctaLabel);

            var capturedId = entry.launchId;
            var capturedLocked = locked;
            _cta.clicked += () => onCta?.Invoke(capturedId, capturedLocked);
            body.Add(_cta);
            Add(body);

            RegisterCallback<ClickEvent>(evt =>
            {
                if (evt.target is Button) return;
                onSelect?.Invoke(capturedId);
            });
        }

        public void SetSelected(bool selected) =>
            EnableInClassList("theater-card--selected", selected);

        public void SetLocked(bool locked, bool showFreeBadge)
        {
            IsLocked = locked;
            EnableInClassList("theater-card--locked", locked);
            if (_ctaLabel != null)
                _ctaLabel.text = locked ? UnlockCtaLabel : PlayCtaLabel;
            _cta?.EnableInClassList("theater-card__cta--lock", locked);
            _cta?.EnableInClassList("theater-card__cta--play", !locked);
        }

        public static void LoadThumbnail(VisualElement thumb, TheaterSelectionEntry entry)
        {
            if (thumb == null || entry == null) return;
            try
            {
                var preview = MapTextureLibrary.LoadUiMapPreview(
                    entry.launchId, entry.terrainKey ?? entry.region, size: 384);
                if (preview != null)
                    thumb.style.backgroundImage = new StyleBackground(preview);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] Atlas thumb failed for {entry.launchId}: {ex.Message}");
            }
        }

        public static string ShortRegion(string region)
        {
            if (string.IsNullOrEmpty(region)) return "Theater";
            int cut = region.IndexOf('·');
            if (cut < 0) cut = region.IndexOf(',');
            string head = cut > 0 ? region.Substring(0, cut).Trim() : region.Trim();
            return head.Length > 18 ? head.Substring(0, 17).TrimEnd() + "…" : head;
        }
    }
}
