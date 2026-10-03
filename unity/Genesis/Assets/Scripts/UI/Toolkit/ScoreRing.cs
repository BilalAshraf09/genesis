using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Animated score ring drawn with Painter2D.
    /// 270-degree arc (gap at bottom), amber fill animates 0→score over 1 s in Play mode.
    /// Rank letter S–E displayed big at centre; numeric score below.
    /// </summary>
    [UxmlElement]
    public partial class ScoreRing : VisualElement
    {
        // ── Constants ─────────────────────────────────────────────────────────
        const float StartDeg   = 135f;   // lower-left (7:30 o'clock in screen-space)
        const float TotalDeg   = 270f;   // gap at bottom
        const float TrackW     = 18f;
        const float AnimDurSec = 1.0f;

        static readonly Color ColTrack  = new Color(0.09f,  0.137f, 0.227f, 1f);  // surface-2
        static readonly Color ColAmber  = new Color(0.961f, 0.647f, 0.141f, 1f);  // accent

        // ── State ─────────────────────────────────────────────────────────────
        float _targetScore;
        float _animScore;
        float _animStart;
        IVisualElementScheduledItem _anim;

        Label _rankLabel;
        Label _scoreLabel;

        // ── UXML attributes ───────────────────────────────────────────────────

        [UxmlAttribute]
        public int targetScore
        {
            get => Mathf.RoundToInt(_targetScore);
            set
            {
                _targetScore = Mathf.Clamp(value, 0, 100);
                if (!Application.isPlaying)
                {
                    _animScore = _targetScore;
                    RefreshScoreLabel();
                    MarkDirtyRepaint();
                }
                else if (panel != null)
                {
                    BeginAnimation();
                }
            }
        }

        [UxmlAttribute]
        public string rankText
        {
            get => _rankLabel?.text ?? "–";
            set
            {
                if (_rankLabel != null) _rankLabel.text = string.IsNullOrEmpty(value) ? "–" : value;
            }
        }

        // ── Constructor ───────────────────────────────────────────────────────
        public ScoreRing()
        {
            generateVisualContent += Draw;

            _rankLabel = new Label { pickingMode = PickingMode.Ignore };
            _rankLabel.AddToClassList("score-ring__rank");

            _scoreLabel = new Label { pickingMode = PickingMode.Ignore };
            _scoreLabel.AddToClassList("score-ring__score");

            Add(_rankLabel);
            Add(_scoreLabel);

            RegisterCallback<AttachToPanelEvent>(_ =>
            {
                if (Application.isPlaying)
                    BeginAnimation();
                else
                {
                    _animScore = _targetScore;
                    RefreshScoreLabel();
                    MarkDirtyRepaint();
                }
            });
        }

        // ── Public API ────────────────────────────────────────────────────────
        /// <summary>Sets score and rank; starts animation in Play mode, instant in Edit mode.</summary>
        public void SetScore(int score, string rank)
        {
            _targetScore = Mathf.Clamp(score, 0, 100);
            if (_rankLabel != null) _rankLabel.text = string.IsNullOrEmpty(rank) ? "–" : rank;

            if (!Application.isPlaying)
            {
                _animScore = _targetScore;
                RefreshScoreLabel();
                MarkDirtyRepaint();
            }
            else if (panel != null)
            {
                BeginAnimation();
            }
        }

        // ── Animation ─────────────────────────────────────────────────────────
        void BeginAnimation()
        {
            _anim?.Pause();
            _animScore = 0f;
            _animStart = Time.realtimeSinceStartup;
            RefreshScoreLabel();
            MarkDirtyRepaint();

            _anim = schedule.Execute(() =>
            {
                float t    = Mathf.Clamp01((Time.realtimeSinceStartup - _animStart) / AnimDurSec);
                float ease = 1f - (1f - t) * (1f - t); // ease-out quad
                _animScore = _targetScore * ease;
                RefreshScoreLabel();
                MarkDirtyRepaint();

                if (t >= 1f)
                {
                    _animScore = _targetScore;
                    RefreshScoreLabel();
                    MarkDirtyRepaint();
                    _anim.Pause();
                }
            }).Every(16);
        }

        void RefreshScoreLabel()
        {
            if (_scoreLabel != null)
                _scoreLabel.text = Mathf.RoundToInt(_animScore).ToString();
        }

        // ── Drawing ───────────────────────────────────────────────────────────
        void Draw(MeshGenerationContext ctx)
        {
            float w = contentRect.width;
            float h = contentRect.height;
            if (w < 2f || h < 2f) return;

            float cx = w * 0.5f;
            float cy = h * 0.5f;
            float r  = Mathf.Min(cx, cy) - TrackW;
            if (r < 4f) return;

            var p = ctx.painter2D;

            // Background track
            p.strokeColor = ColTrack;
            p.lineWidth   = TrackW;
            p.lineCap     = LineCap.Round;
            p.BeginPath();
            p.Arc(new Vector2(cx, cy), r,
                  Angle.Degrees(StartDeg),
                  Angle.Degrees(StartDeg + TotalDeg),
                  ArcDirection.Clockwise);
            p.Stroke();

            // Amber fill arc
            if (_animScore > 0.5f)
            {
                float fillDeg = (_animScore / 100f) * TotalDeg;
                p.strokeColor = ColAmber;
                p.lineWidth   = TrackW;
                p.lineCap     = LineCap.Round;
                p.BeginPath();
                p.Arc(new Vector2(cx, cy), r,
                      Angle.Degrees(StartDeg),
                      Angle.Degrees(StartDeg + fillDeg),
                      ArcDirection.Clockwise);
                p.Stroke();
            }
        }
    }
}
