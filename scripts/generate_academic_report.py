#!/usr/bin/env python3
"""Generate Mansh Sahu's premium A4 academic progress report."""

from pathlib import Path
from math import ceil

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "deliverables" / "Mansh_Sahu_Academic_Progress_Report_2026.pdf"
FONT_DIR = ROOT / "assets" / "fonts"

PAGE_W, PAGE_H = A4
BLUE = HexColor("#2563EB")
DEEP_BLUE = HexColor("#1D4ED8")
PURPLE = HexColor("#7C3AED")
CYAN = HexColor("#06B6D4")
NAVY = HexColor("#172554")
INK = HexColor("#172033")
MUTED = HexColor("#64748B")
LINE = HexColor("#E2E8F0")
PALE_BLUE = HexColor("#EFF6FF")
PALE_PURPLE = HexColor("#F5F3FF")
PALE_CYAN = HexColor("#ECFEFF")
PALE_SLATE = HexColor("#F8FAFC")
GREEN = HexColor("#10B981")

MATH = [
    {
        "title": "PART 1  |  CALCULATION FOUNDATION",
        "icon": "calculator",
        "items": [
            "Tables (2–20)", "Reverse Tables", "Practice", "Multiplication Speed",
            "Addition", "Subtraction", "Multiplication", "Division", "Long Division",
            "BODMAS", "Mental Calculation", "Natural Numbers", "Whole Numbers",
            "Integers", "Positive & Negative Numbers", "Even & Odd Numbers",
        ],
    },
    {
        "title": "PART 2  |  SQUARES & CUBES",
        "icon": "formula",
        "items": ["Squares (1–50)", "Cubes (1–50)"],
    },
    {
        "title": "PART 4  |  HCF & LCM",
        "icon": "numbers",
        "items": [
            "Prime Factorization", "HCF", "LCM", "HCF using Division Method",
            "Word Problems", "Relationship between HCF & LCM",
        ],
    },
    {
        "title": "PART 5  |  RATIO & PROPORTION",
        "icon": "ratio",
        "items": ["Ratio", "Equivalent Ratio", "Simplest Ratio", "Comparing Ratios", "Proportion"],
    },
    {
        "title": "PART 6  |  PERCENTAGE",
        "icon": "percent",
        "items": [
            "Percentage Meaning", "Fraction → Percentage", "Decimal → Percentage",
            "Percentage → Fraction", "Percentage → Decimal",
        ],
    },
    {
        "title": "PART 7  |  PROFIT & LOSS",
        "icon": "chart",
        "groups": [
            ("CORE CONCEPTS", [
                "Cost Price (CP)", "Selling Price (SP)", "Profit", "Loss",
                "Profit %", "Loss %", "Basic Discount",
            ]),
            ("FORMULAS", [
                "Profit = SP − CP", "Loss = CP − SP",
                "Profit % = (Profit ÷ CP) × 100",
                "Loss % = (Loss ÷ CP) × 100",
            ]),
        ],
    },
    {
        "title": "PART 8  |  ALGEBRA BASICS",
        "icon": "formula",
        "items": [
            "Variables", "Constants", "Terms", "Algebraic Expressions", "Simplification",
            "Addition of Expressions", "Subtraction of Expressions", "Multiplication of Expressions",
        ],
    },
    {
        "title": "PART 9  |  IMPORTANT ALGEBRA FORMULAS",
        "icon": "formula",
        "items": [
            "(a + b)²", "(a − b)²", "(a + b)(a − b)", "(x + a)(x + b)",
            "(x − a)(x − b)", "(x + a)(x − b)", "(a + b + c)²",
            "(a + b)³", "(a − b)³", "a³ + b³", "a³ − b³",
        ],
    },
    {
        "title": "PART 19  |  BASIC SPEED, TIME & DISTANCE",
        "icon": "speed",
        "groups": [
            ("PRACTICE", ["Basic Word Problems"]),
            ("FORMULAS", [
                "Speed = Distance ÷ Time", "Distance = Speed × Time", "Time = Distance ÷ Speed",
            ]),
        ],
    },
]

ENGLISH = [
    {
        "title": "LEVEL 1  |  BASIC ENGLISH FOUNDATION",
        "icon": "grammar",
        "items": [
            "A–Z", "Vowels & Consonants", "Word Formation", "Spelling", "Singular & Plural",
            "Common Vocabulary", "Word Meanings", "Noun", "Pronoun", "Verb", "Adjective",
            "Adverb", "Preposition", "Conjunction", "Interjection", "Articles / Determiners",
        ],
    },
    {
        "title": "LEVEL 2  |  SENTENCE FORMATION",
        "icon": "writing",
        "items": [
            "Sentence", "Subject", "Predicate", "Object", "Subject + Verb + Object",
            "Affirmative Sentence", "Negative Sentence", "Interrogative Sentence",
            "Imperative Sentence", "Exclamatory Sentence",
        ],
    },
    {
        "title": "LEVEL 3  |  TENSES",
        "icon": "time",
        "groups": [
            ("PRESENT", ["Simple Present", "Present Continuous", "Present Perfect", "Present Perfect Continuous"]),
            ("PAST", ["Simple Past", "Past Continuous", "Past Perfect", "Past Perfect Continuous"]),
            ("FUTURE", ["Simple Future", "Future Continuous", "Future Perfect", "Future Perfect Continuous"]),
        ],
    },
    {
        "title": "LEVEL 4  |  IMPORTANT GRAMMAR",
        "icon": "grammar",
        "groups": [
            ("SUBJECT–VERB AGREEMENT", [
                "Singular Subject", "Plural Subject", "Is / Am / Are", "Was / Were",
                "Has / Have", "Do / Does",
            ]),
            ("ARTICLES", ["A", "An", "The", "Zero Article"]),
            ("PREPOSITIONS", [
                "In", "On", "At", "By", "With", "From", "To", "For", "Since", "During",
                "Between", "Among", "Under", "Over", "Behind", "Beside",
            ]),
            ("CONJUNCTIONS", [
                "And", "But", "Or", "Because", "Although", "If", "When", "While", "Unless", "So",
            ]),
        ],
    },
    {
        "title": "LEVEL 5  |  ADVANCED GRAMMAR",
        "icon": "grammar",
        "groups": [
            ("MODALS", [
                "Can", "Could", "May", "Might", "Must", "Should", "Would", "Shall",
                "Will", "Ought to", "Need", "Used to",
            ]),
            ("ACTIVE & PASSIVE VOICE", ["Present Tense", "Past Tense", "Future Tense", "Modal Verbs"]),
            ("DIRECT & INDIRECT SPEECH", [
                "Statements", "Questions", "Commands", "Requests", "Tense Changes",
                "Pronoun Changes", "Time / Place Word Changes",
            ]),
        ],
    },
    {
        "title": "LEVEL 6  |  SENTENCE TRANSFORMATION",
        "icon": "writing",
        "groups": [
            ("QUESTION FORMATION", ["What", "Why", "When", "Where", "Who", "Whom", "Which", "Whose", "How"]),
            ("SENTENCE TRANSFORMATION", [
                "Affirmative → Negative", "Statement → Question",
                "Simple → Compound", "Compound → Complex",
            ]),
            ("CLAUSES", ["Noun Clause", "Adjective Clause", "Adverb Clause"]),
            ("CONDITIONALS", ["Zero Conditional", "First Conditional", "Second Conditional", "Third Conditional"]),
        ],
    },
    {
        "title": "LEVEL 7  |  VOCABULARY",
        "icon": "vocabulary",
        "items": [
            "Synonyms", "Antonyms", "One-Word Substitution", "Homophones", "Homonyms",
            "Prefix", "Suffix", "Idioms & Phrases", "Phrasal Verbs",
            "Common Confusing Words", "Word Formation",
        ],
    },
    {
        "title": "LEVEL 8  |  READING SKILLS",
        "icon": "reading",
        "items": [
            "Loud Reading", "Silent Reading", "Unseen Passage", "Reading Comprehension",
            "Finding Answers", "Vocabulary from Passage",
        ],
    },
    {
        "title": "LEVEL 9  |  WRITING SKILLS",
        "icon": "writing",
        "items": [
            "Paragraph Writing", "Application Writing", "Letter Writing", "Essay Writing",
            "Story Writing", "Notice Writing", "Message Writing",
        ],
    },
    {
        "title": "LEVEL 10  |  SPEAKING ENGLISH",
        "icon": "speaking",
        "items": ["Self Introduction", "Daily Conversation", "Topic Speaking"],
    },
]


def item_count(section):
    if "items" in section:
        return len(section["items"])
    return sum(len(items) for _, items in section["groups"])


MATH_TOPICS = sum(item_count(x) for x in MATH)
ENGLISH_TOPICS = sum(item_count(x) for x in ENGLISH)
TOTAL_TOPICS = MATH_TOPICS + ENGLISH_TOPICS


def register_fonts():
    pdfmetrics.registerFont(TTFont("Poppins", str(FONT_DIR / "Poppins-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Poppins-Medium", str(FONT_DIR / "Poppins-Medium.ttf")))
    pdfmetrics.registerFont(TTFont("Poppins-SemiBold", str(FONT_DIR / "Poppins-SemiBold.ttf")))
    pdfmetrics.registerFont(TTFont("Poppins-Bold", str(FONT_DIR / "Poppins-Bold.ttf")))


def mix(c1, c2, t):
    return Color(
        c1.red + (c2.red - c1.red) * t,
        c1.green + (c2.green - c1.green) * t,
        c1.blue + (c2.blue - c1.blue) * t,
    )


def tint(color, amount=0.90):
    return mix(color, white, amount)


def gradient_round_rect(c, x, y, w, h, c1, c2, radius=14, vertical=False, steps=80):
    c.saveState()
    path = c.beginPath()
    path.roundRect(x, y, w, h, radius)
    c.clipPath(path, stroke=0, fill=0)
    for i in range(steps):
        t = i / max(steps - 1, 1)
        c.setFillColor(mix(c1, c2, t))
        if vertical:
            sy = y + (h * i / steps)
            c.rect(x, sy, w, h / steps + 0.6, stroke=0, fill=1)
        else:
            sx = x + (w * i / steps)
            c.rect(sx, y, w / steps + 0.6, h, stroke=0, fill=1)
    c.restoreState()


def alpha(c, value):
    try:
        c.setFillAlpha(value)
    except Exception:
        pass


def card(c, x, y, w, h, radius=15, fill=white, border=LINE, shadow=True):
    if shadow:
        c.saveState()
        alpha(c, 0.08)
        c.setFillColor(HexColor("#0F172A"))
        c.roundRect(x + 2, y - 4, w, h, radius, stroke=0, fill=1)
        c.restoreState()
    c.setFillColor(fill)
    c.setStrokeColor(border)
    c.setLineWidth(0.75)
    c.roundRect(x, y, w, h, radius, stroke=1, fill=1)


def set_font(c, name, size, color=INK):
    c.setFont(name, size)
    c.setFillColor(color)


def center_text(c, text, x, y, font="Poppins", size=9, color=INK):
    set_font(c, font, size, color)
    c.drawCentredString(x, y, text)


def draw_arrow_text(c, text, cx, y, font="Poppins", size=8.3, color=INK):
    """Center text and draw unsupported right-arrow glyph as a vector."""
    if "→" not in text:
        center_text(c, text, cx, y, font, size, color)
        return
    pieces = text.split("→")
    widths = [pdfmetrics.stringWidth(p, font, size) for p in pieces]
    arrow_w = max(8.0, size * 1.05)
    total = sum(widths) + arrow_w * (len(pieces) - 1)
    x = cx - total / 2
    set_font(c, font, size, color)
    for i, piece in enumerate(pieces):
        c.drawString(x, y, piece)
        x += widths[i]
        if i < len(pieces) - 1:
            ay = y + size * 0.34
            c.setStrokeColor(color)
            c.setLineWidth(max(0.7, size * 0.085))
            c.line(x + 1, ay, x + arrow_w - 2, ay)
            c.line(x + arrow_w - 5, ay + 2.4, x + arrow_w - 2, ay)
            c.line(x + arrow_w - 5, ay - 2.4, x + arrow_w - 2, ay)
            x += arrow_w


def wrap_text(text, font, size, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        trial = word if not current else current + " " + word
        if pdfmetrics.stringWidth(trial.replace("→", ">"), font, size) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines or [""]


def icon(c, kind, cx, cy, size=18, color=BLUE, on_dark=False):
    """Draw small vector academic icons, avoiding platform-dependent emoji fonts."""
    stroke = white if on_dark else color
    c.saveState()
    c.setStrokeColor(stroke)
    c.setFillColor(stroke)
    c.setLineCap(1)
    c.setLineJoin(1)
    c.setLineWidth(max(1.2, size * 0.08))
    s = size
    x, y = cx, cy

    if kind in ("book", "reading"):
        c.roundRect(x - s * .46, y - s * .34, s * .42, s * .65, s * .06, stroke=1, fill=0)
        c.roundRect(x + s * .04, y - s * .34, s * .42, s * .65, s * .06, stroke=1, fill=0)
        c.line(x, y - s * .30, x, y + s * .28)
        c.line(x - s * .34, y + s * .12, x - s * .12, y + s * .12)
        c.line(x + s * .12, y + s * .12, x + s * .34, y + s * .12)
    elif kind == "calculator":
        c.roundRect(x - s*.34, y - s*.42, s*.68, s*.84, s*.08, stroke=1, fill=0)
        c.roundRect(x - s*.23, y + s*.12, s*.46, s*.16, s*.03, stroke=1, fill=0)
        for ry in (-.18, .0):
            for rx in (-.18, 0, .18):
                c.circle(x + s*rx, y + s*ry, s*.035, stroke=0, fill=1)
    elif kind in ("formula", "numbers"):
        set_font(c, "Poppins-Bold", s*.72, stroke)
        c.drawCentredString(x, y - s*.23, "x²")
    elif kind == "ratio":
        c.circle(x - s*.20, y + s*.16, s*.08, stroke=1, fill=0)
        c.circle(x + s*.20, y - s*.16, s*.08, stroke=1, fill=0)
        c.circle(x, y, s*.035, stroke=0, fill=1)
        c.line(x - s*.26, y - s*.30, x + s*.26, y + s*.30)
    elif kind == "percent":
        set_font(c, "Poppins-Bold", s*.78, stroke)
        c.drawCentredString(x, y - s*.26, "%")
    elif kind == "chart":
        c.line(x - s*.38, y - s*.34, x - s*.38, y + s*.34)
        c.line(x - s*.38, y - s*.34, x + s*.40, y - s*.34)
        for i, hh in enumerate((.25, .48, .72)):
            c.setFillColor(stroke)
            c.roundRect(x - s*.24 + i*s*.23, y - s*.30, s*.13, s*hh, s*.025, stroke=0, fill=1)
    elif kind == "speed":
        c.circle(x, y, s*.36, stroke=1, fill=0)
        c.line(x, y, x + s*.21, y + s*.15)
        c.circle(x, y, s*.04, stroke=0, fill=1)
    elif kind == "grammar":
        set_font(c, "Poppins-Bold", s*.64, stroke)
        c.drawCentredString(x, y - s*.21, "Aa")
    elif kind == "writing":
        c.setLineWidth(s*.12)
        c.line(x - s*.28, y - s*.27, x + s*.24, y + s*.25)
        c.setLineWidth(s*.06)
        c.line(x - s*.34, y - s*.36, x - s*.26, y - s*.24)
        c.line(x - s*.34, y - s*.36, x - s*.22, y - s*.33)
    elif kind == "time":
        c.circle(x, y, s*.36, stroke=1, fill=0)
        c.line(x, y, x, y + s*.20)
        c.line(x, y, x + s*.17, y - s*.09)
    elif kind == "vocabulary":
        set_font(c, "Poppins-Bold", s*.52, stroke)
        c.drawCentredString(x, y - s*.18, "ABC")
    elif kind == "speaking":
        c.roundRect(x - s*.38, y - s*.23, s*.76, s*.48, s*.14, stroke=1, fill=0)
        c.line(x - s*.14, y - s*.23, x - s*.24, y - s*.37)
        for dx in (-.15, 0, .15):
            c.circle(x + s*dx, y + s*.01, s*.025, stroke=0, fill=1)
    elif kind == "target":
        for r in (.37, .23, .09):
            c.circle(x, y, s*r, stroke=1, fill=0)
        c.line(x, y, x + s*.38, y + s*.38)
    elif kind == "check":
        c.setLineWidth(max(1.7, s*.12))
        c.line(x - s*.33, y, x - s*.08, y - s*.24)
        c.line(x - s*.08, y - s*.24, x + s*.36, y + s*.28)
    elif kind == "trophy":
        c.roundRect(x - s*.23, y - s*.05, s*.46, s*.36, s*.08, stroke=1, fill=0)
        c.arc(x - s*.43, y - s*.02, x - s*.10, y + s*.29, 90, 180)
        c.arc(x + s*.10, y - s*.02, x + s*.43, y + s*.29, 270, 180)
        c.line(x, y - s*.05, x, y - s*.28)
        c.line(x - s*.20, y - s*.31, x + s*.20, y - s*.31)
    elif kind == "user":
        c.circle(x, y + s*.18, s*.15, stroke=1, fill=0)
        c.arc(x - s*.31, y - s*.38, x + s*.31, y + s*.03, 0, 180)
    else:
        c.circle(x, y, s*.3, stroke=1, fill=0)
    c.restoreState()


def footer(c, page_num, dedication=False):
    y = 25
    gradient_round_rect(c, 38, y + 14, PAGE_W - 76, 2.2, BLUE, PURPLE, 1, steps=60)
    if dedication:
        center_text(c, "Prepared with dedication for the student's learning journey.", PAGE_W/2, y + 23,
                    "Poppins", 6.8, MUTED)
    center_text(c, "ACADEMIC PROGRESS REPORT", 112, y, "Poppins-SemiBold", 6.4, NAVY)
    center_text(c, "© 2026 NAVEEN KASHYAP", PAGE_W/2, y, "Poppins", 6.4, MUTED)
    center_text(c, f"PAGE {page_num:02d}", PAGE_W - 77, y, "Poppins-SemiBold", 6.4, NAVY)


def content_background(c, page_num, dedication=False):
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    gradient_round_rect(c, 0, PAGE_H - 10, PAGE_W, 10, BLUE, PURPLE, 0, steps=100)
    c.setFillColor(PALE_BLUE)
    c.circle(PAGE_W + 10, PAGE_H - 42, 55, stroke=0, fill=1)
    c.setFillColor(PALE_PURPLE)
    c.circle(-12, 64, 38, stroke=0, fill=1)
    footer(c, page_num, dedication)


def subject_banner(c, title, subtitle, kind, y=747, h=66, c1=BLUE, c2=PURPLE):
    gradient_round_rect(c, 38, y, PAGE_W - 76, h, c1, c2, 18, steps=100)
    c.saveState()
    alpha(c, .12)
    c.setFillColor(white)
    c.circle(75, y + h/2, 38, stroke=0, fill=1)
    c.circle(PAGE_W - 65, y + h + 2, 52, stroke=0, fill=1)
    c.restoreState()
    c.setFillColor(white)
    c.circle(PAGE_W/2, y + h - 9, 20, stroke=0, fill=1)
    icon(c, kind, PAGE_W/2, y + h - 9, 19, c1)
    center_text(c, title, PAGE_W/2, y + h/2 - 5, "Poppins-Bold", 15, white)
    center_text(c, subtitle, PAGE_W/2, y + 12, "Poppins-Medium", 7.2, white)


def compact_banner(c, title, subtitle, page_num, kind="book", c1=BLUE, c2=PURPLE):
    content_background(c, page_num)
    subject_banner(c, title, subtitle, kind, y=770, h=48, c1=c1, c2=c2)


def draw_topic_lines(c, items, x, y, w, h, columns=2, accent=BLUE, font_size=8.1):
    columns = max(1, columns)
    col_gap = 12
    col_w = (w - col_gap * (columns - 1)) / columns
    per_col = ceil(len(items) / columns)
    for col in range(columns):
        chunk = items[col * per_col:(col + 1) * per_col]
        if not chunk:
            continue
        cx = x + col * (col_w + col_gap) + col_w / 2
        cell_h = h / max(len(chunk), 1)
        for row, item in enumerate(chunk):
            cy = y + h - (row + .5) * cell_h
            lines = wrap_text(item, "Poppins", font_size, col_w - 24)
            line_h = min(10.5, cell_h * .42)
            start = cy + ((len(lines) - 1) * line_h / 2) - font_size * .32
            if len(lines) == 1:
                text_w = pdfmetrics.stringWidth(item.replace("→", ">"), "Poppins", font_size)
                dot_x = cx - text_w/2 - 7
                c.setFillColor(accent)
                c.circle(dot_x, cy + 1, 1.55, stroke=0, fill=1)
            for idx, line in enumerate(lines):
                draw_arrow_text(c, line, cx, start - idx * line_h, "Poppins", font_size, INK)
    if columns > 1:
        for col in range(1, columns):
            sx = x + col * col_w + (col - .5) * col_gap
            c.setStrokeColor(LINE)
            c.setLineWidth(.45)
            c.line(sx, y + 3, sx, y + h - 3)


def topic_card(c, x, y, w, h, title, items, kind, accent=BLUE, accent2=PURPLE,
               columns=2, font_size=8.1):
    card(c, x, y, w, h, 15)
    header_h = 36
    gradient_round_rect(c, x, y + h - header_h, w, header_h, accent, accent2, 15, steps=80)
    # White lower mask squares off the title bar's lower corners while preserving outer card rounding.
    c.setFillColor(white)
    c.rect(x, y + h - header_h, w, 7, stroke=0, fill=1)
    c.setFillColor(white)
    c.circle(x + 27, y + h - header_h/2 + 1, 11, stroke=0, fill=1)
    icon(c, kind, x + 27, y + h - header_h/2 + 1, 12.5, accent)
    center_text(c, title, x + w/2 + 8, y + h - 23, "Poppins-SemiBold", 9.2, white)
    draw_topic_lines(c, items, x + 13, y + 10, w - 26, h - header_h - 13,
                     columns=columns, accent=accent, font_size=font_size)


def group_panel(c, x, y, w, h, heading, items, accent=BLUE, font_size=7.8):
    c.setFillColor(tint(accent, .94))
    c.setStrokeColor(tint(accent, .79))
    c.setLineWidth(.55)
    c.roundRect(x, y, w, h, 10, stroke=1, fill=1)
    pill_w = min(w - 20, max(75, pdfmetrics.stringWidth(heading, "Poppins-SemiBold", 7.1) + 24))
    c.setFillColor(tint(accent, .80))
    c.roundRect(x + (w-pill_w)/2, y + h - 27, pill_w, 17, 8.5, stroke=0, fill=1)
    center_text(c, heading, x + w/2, y + h - 21.5, "Poppins-SemiBold", 7.1, accent)
    draw_topic_lines(c, items, x + 6, y + 8, w - 12, h - 41, columns=1,
                     accent=accent, font_size=font_size)


def grouped_card(c, x, y, w, h, title, groups, kind, accent=BLUE, accent2=PURPLE,
                 grid_cols=None, font_size=7.8):
    card(c, x, y, w, h, 15)
    header_h = 38
    gradient_round_rect(c, x, y + h - header_h, w, header_h, accent, accent2, 15, steps=80)
    c.setFillColor(white)
    c.rect(x, y + h - header_h, w, 7, stroke=0, fill=1)
    c.setFillColor(white)
    c.circle(x + 29, y + h - 19, 11, stroke=0, fill=1)
    icon(c, kind, x + 29, y + h - 19, 12.5, accent)
    center_text(c, title, x + w/2 + 9, y + h - 25, "Poppins-SemiBold", 9.3, white)

    n = len(groups)
    cols = grid_cols or n
    rows = ceil(n / cols)
    gap = 10
    body_x, body_y = x + 12, y + 12
    body_w, body_h = w - 24, h - header_h - 16
    panel_w = (body_w - gap*(cols-1)) / cols
    panel_h = (body_h - gap*(rows-1)) / rows
    for i, (heading, items) in enumerate(groups):
        row = i // cols
        col = i % cols
        px = body_x + col * (panel_w + gap)
        py = body_y + (rows - 1 - row) * (panel_h + gap)
        group_panel(c, px, py, panel_w, panel_h, heading, items, accent, font_size)


def stat_card(c, x, y, w, h, label, value, kind, accent):
    card(c, x, y, w, h, 14)
    c.setFillColor(tint(accent, .91))
    c.circle(x + w/2, y + h - 22, 13, stroke=0, fill=1)
    icon(c, kind, x + w/2, y + h - 22, 13, accent)
    center_text(c, value, x + w/2, y + 27, "Poppins-Bold", 18, NAVY)
    center_text(c, label.upper(), x + w/2, y + 12, "Poppins-SemiBold", 6.5, MUTED)


def progress_ring(c, cx, cy, radius, accent=BLUE, accent2=PURPLE, value="100%"):
    c.setLineWidth(13)
    c.setStrokeColor(HexColor("#E8EEF8"))
    c.circle(cx, cy, radius, stroke=1, fill=0)
    # A full two-tone ring communicates 100% completion while retaining the brand gradient.
    c.setStrokeColor(accent)
    c.arc(cx-radius, cy-radius, cx+radius, cy+radius, 90, 180)
    c.setStrokeColor(accent2)
    c.arc(cx-radius, cy-radius, cx+radius, cy+radius, 270, 180)
    c.setFillColor(tint(accent, .94))
    c.circle(cx, cy, radius - 15, stroke=0, fill=1)
    icon(c, "trophy", cx, cy + 25, 24, accent)
    center_text(c, value, cx, cy - 8, "Poppins-Bold", 24, NAVY)
    center_text(c, "COMPLETE", cx, cy - 28, "Poppins-SemiBold", 7, MUTED)


def progress_page(c, page_num, subject, sections, topics, kind, c1, c2, next_text=None):
    content_background(c, page_num)
    subject_banner(c, f"{subject.upper()} COMPLETION", "SYLLABUS MASTERY OVERVIEW", kind,
                   y=747, h=66, c1=c1, c2=c2)
    card(c, 62, 300, PAGE_W - 124, 420, 24)
    center_text(c, f"{subject} Completion", PAGE_W/2, 676, "Poppins-Bold", 17, NAVY)
    center_text(c, "Every listed learning objective has been covered.", PAGE_W/2, 657,
                "Poppins", 8, MUTED)
    progress_ring(c, PAGE_W/2, 510, 84, c1, c2)
    sw = 132
    gap = 16
    sx = (PAGE_W - (sw*3 + gap*2))/2
    stat_card(c, sx, 335, sw, 92, "Curriculum Units", str(sections), "book", c1)
    stat_card(c, sx + sw + gap, 335, sw, 92, "Topics Covered", str(topics), "check", c2)
    stat_card(c, sx + (sw + gap)*2, 335, sw, 92, "Status", "100%", "target", CYAN)
    gradient_round_rect(c, 82, 196, PAGE_W - 164, 76, c1, c2, 16, steps=80)
    icon(c, "check", PAGE_W/2, 249, 16, white, on_dark=True)
    center_text(c, "SUBJECT COMPLETED", PAGE_W/2, 224, "Poppins-Bold", 12, white)
    center_text(c, "Consistent practice will help turn strong foundations into lasting mastery.",
                PAGE_W/2, 208, "Poppins", 6.8, white)
    if next_text:
        center_text(c, next_text.upper(), PAGE_W/2, 146, "Poppins-SemiBold", 7, MUTED)
        c.setStrokeColor(c1)
        c.setLineWidth(1.2)
        c.line(PAGE_W/2 - 62, 133, PAGE_W/2 + 62, 133)
    c.showPage()


def cover_page(c):
    c.setFillColor(white)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    # Premium gradient hero.
    gradient_round_rect(c, 0, 520, PAGE_W, PAGE_H - 520, BLUE, PURPLE, 0, steps=140)
    c.saveState()
    alpha(c, .11)
    c.setFillColor(white)
    c.circle(28, 790, 84, stroke=0, fill=1)
    c.circle(PAGE_W - 20, 600, 116, stroke=0, fill=1)
    c.circle(PAGE_W - 72, 800, 44, stroke=0, fill=1)
    c.restoreState()

    c.setFillColor(white)
    c.circle(PAGE_W/2, 785, 25, stroke=0, fill=1)
    icon(c, "book", PAGE_W/2, 785, 27, BLUE)
    center_text(c, "MANSH SAHU", PAGE_W/2, 742, "Poppins-Bold", 25, white)
    gradient_round_rect(c, PAGE_W/2 - 52, 708, 104, 21, CYAN, BLUE, 10.5, steps=50)
    center_text(c, "CLASS – 7", PAGE_W/2, 715, "Poppins-SemiBold", 8.2, white)
    center_text(c, "ACADEMIC PROGRESS REPORT", PAGE_W/2, 677, "Poppins-Bold", 14, white)
    center_text(c, "Mathematics & English Syllabus Completion Report", PAGE_W/2, 658,
                "Poppins-Medium", 8.6, white)
    center_text(c, "UPDATED VERSION  •  2026", PAGE_W/2, 639, "Poppins-SemiBold", 6.8,
                HexColor("#CFFAFE"))
    c.setStrokeColor(Color(1,1,1,alpha=.45))
    c.setLineWidth(.7)
    c.line(PAGE_W/2 - 105, 619, PAGE_W/2 + 105, 619)
    center_text(c, "PREPARED BY", PAGE_W/2, 600, "Poppins-SemiBold", 6.5, HexColor("#DBEAFE"))
    center_text(c, "Naveen Kashyap", PAGE_W/2, 581, "Poppins-Bold", 11, white)
    center_text(c, "MERN Stack Developer & Educator", PAGE_W/2, 566, "Poppins", 7.1, HexColor("#E0E7FF"))

    center_text(c, "REPORT SUMMARY", PAGE_W/2, 496, "Poppins-Bold", 9, NAVY)
    gradient_round_rect(c, PAGE_W/2 - 82, 484, 164, 3, BLUE, PURPLE, 1.5, steps=50)

    gap = 12
    w = (PAGE_W - 76 - gap*2)/3
    stat_card(c, 38, 395, w, 78, "Subjects", "2", "book", BLUE)
    stat_card(c, 38+w+gap, 395, w, 78, "Topics Covered", str(TOTAL_TOPICS), "check", PURPLE)
    stat_card(c, 38+(w+gap)*2, 395, w, 78, "Completion Status", "100%", "target", CYAN)

    # Lower left snapshot card and required right-side information card.
    card(c, 38, 84, 245, 286, 18)
    center_text(c, "LEARNING SNAPSHOT", 160.5, 342, "Poppins-Bold", 9, NAVY)
    progress_ring(c, 160.5, 245, 58, BLUE, PURPLE)
    center_text(c, "2 SUBJECTS  •  19 CURRICULUM UNITS", 160.5, 155,
                "Poppins-SemiBold", 6.8, BLUE)
    center_text(c, f"{TOTAL_TOPICS} carefully structured learning topics", 160.5, 136,
                "Poppins", 7.2, MUTED)
    c.setFillColor(PALE_BLUE)
    c.roundRect(72, 104, 177, 20, 10, stroke=0, fill=1)
    center_text(c, "COMPLETE  •  READY FOR PRACTICE", 160.5, 111, "Poppins-SemiBold", 6.3, BLUE)

    card(c, 300, 84, PAGE_W - 338, 286, 18)
    c.setFillColor(PALE_PURPLE)
    c.circle(PAGE_W/2 + 128, 335, 17, stroke=0, fill=1)
    icon(c, "user", PAGE_W/2 + 128, 335, 16, PURPLE)
    center_text(c, "STUDENT INFORMATION", PAGE_W/2 + 128, 305, "Poppins-Bold", 9, NAVY)
    fields = [
        ("STUDENT NAME", "Mansh Sahu"),
        ("CLASS", "7"),
        ("SUBJECTS", "Mathematics & English"),
        ("STATUS", "Completed"),
        ("PREPARED BY", "Naveen Kashyap"),
    ]
    fy = 274
    for i, (label, value) in enumerate(fields):
        center_text(c, label, PAGE_W/2 + 128, fy, "Poppins-SemiBold", 5.9, MUTED)
        center_text(c, value, PAGE_W/2 + 128, fy - 15, "Poppins-Bold" if i == 0 else "Poppins-Medium",
                    8.1 if i != 2 else 7.1, NAVY)
        if i < len(fields)-1:
            c.setStrokeColor(LINE)
            c.setLineWidth(.45)
            c.line(328, fy - 25, PAGE_W - 28, fy - 25)
        fy -= 47

    footer(c, 1, dedication=True)
    c.showPage()


def build_pdf():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    register_fonts()
    c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
    c.setTitle("Mansh Sahu - Academic Progress Report 2026")
    c.setAuthor("Naveen Kashyap")
    c.setSubject("Class 7 Mathematics and English Syllabus Completion Report")
    c.setCreator("Naveen Kashyap | MERN Stack Developer & Educator")

    cover_page(c)

    # Page 2 — Mathematics foundation.
    content_background(c, 2)
    subject_banner(c, "MATHEMATICS", f"9 PARTS  •  {MATH_TOPICS} TOPICS  •  100% COMPLETE", "calculator")
    topic_card(c, 38, 535, PAGE_W-76, 194, MATH[0]["title"], MATH[0]["items"], MATH[0]["icon"], columns=2)
    topic_card(c, 38, 425, PAGE_W-76, 90, MATH[1]["title"], MATH[1]["items"], MATH[1]["icon"], columns=2)
    topic_card(c, 38, 278, PAGE_W-76, 127, MATH[2]["title"], MATH[2]["items"], MATH[2]["icon"], columns=2)
    topic_card(c, 38, 153, PAGE_W-76, 105, MATH[3]["title"], MATH[3]["items"], MATH[3]["icon"], columns=2)
    topic_card(c, 38, 47, PAGE_W-76, 86, MATH[4]["title"], MATH[4]["items"], MATH[4]["icon"], columns=2, font_size=7.5)
    c.showPage()

    # Page 3 — Mathematics application and algebra.
    compact_banner(c, "MATHEMATICS  •  CONTINUED", "APPLICATION  •  ALGEBRA  •  FORMULAS", 3, "formula")
    grouped_card(c, 38, 557, PAGE_W-76, 193, MATH[5]["title"], MATH[5]["groups"], MATH[5]["icon"], grid_cols=2)
    topic_card(c, 38, 409, PAGE_W-76, 128, MATH[6]["title"], MATH[6]["items"], MATH[6]["icon"], columns=2)
    topic_card(c, 38, 214, PAGE_W-76, 175, MATH[7]["title"], MATH[7]["items"], MATH[7]["icon"], columns=2)
    grouped_card(c, 38, 48, PAGE_W-76, 146, MATH[8]["title"], MATH[8]["groups"], MATH[8]["icon"], grid_cols=2)
    c.showPage()

    progress_page(c, 4, "Mathematics", len(MATH), MATH_TOPICS, "calculator", BLUE, PURPLE,
                  "Next: English curriculum")

    # Page 5 — English foundation.
    content_background(c, 5)
    subject_banner(c, "ENGLISH", f"10 LEVELS  •  {ENGLISH_TOPICS} TOPICS  •  100% COMPLETE",
                   "book", c1=PURPLE, c2=CYAN)
    topic_card(c, 38, 535, PAGE_W-76, 194, ENGLISH[0]["title"], ENGLISH[0]["items"], ENGLISH[0]["icon"],
               accent=PURPLE, accent2=CYAN, columns=2)
    topic_card(c, 38, 389, PAGE_W-76, 126, ENGLISH[1]["title"], ENGLISH[1]["items"], ENGLISH[1]["icon"],
               accent=PURPLE, accent2=CYAN, columns=2)
    grouped_card(c, 38, 49, PAGE_W-76, 320, ENGLISH[2]["title"], ENGLISH[2]["groups"], ENGLISH[2]["icon"],
                 accent=PURPLE, accent2=CYAN, grid_cols=3, font_size=8.0)
    c.showPage()

    # Page 6 — Important grammar.
    compact_banner(c, "ENGLISH  •  IMPORTANT GRAMMAR", "LEVEL 4  •  STRUCTURED LANGUAGE FOUNDATIONS", 6,
                   "grammar", PURPLE, CYAN)
    grouped_card(c, 38, 48, PAGE_W-76, 702, ENGLISH[3]["title"], ENGLISH[3]["groups"], ENGLISH[3]["icon"],
                 accent=PURPLE, accent2=CYAN, grid_cols=2, font_size=8.0)
    c.showPage()

    # Page 7 — Advanced grammar.
    compact_banner(c, "ENGLISH  •  ADVANCED GRAMMAR", "LEVEL 5  •  VOICE  •  SPEECH  •  MODALS", 7,
                   "grammar", PURPLE, CYAN)
    grouped_card(c, 38, 92, PAGE_W-76, 658, ENGLISH[4]["title"], ENGLISH[4]["groups"], ENGLISH[4]["icon"],
                 accent=PURPLE, accent2=CYAN, grid_cols=3, font_size=8.2)
    center_text(c, "Clear grammar creates confident communication.", PAGE_W/2, 66,
                "Poppins-Medium", 7.2, MUTED)
    c.showPage()

    # Page 8 — Sentence transformation.
    compact_banner(c, "ENGLISH  •  SENTENCE TRANSFORMATION", "LEVEL 6  •  QUESTIONS  •  CLAUSES  •  CONDITIONALS", 8,
                   "writing", PURPLE, CYAN)
    grouped_card(c, 38, 92, PAGE_W-76, 658, ENGLISH[5]["title"], ENGLISH[5]["groups"], ENGLISH[5]["icon"],
                 accent=PURPLE, accent2=CYAN, grid_cols=2, font_size=8.2)
    center_text(c, "Build accuracy first; fluency follows with practice.", PAGE_W/2, 66,
                "Poppins-Medium", 7.2, MUTED)
    c.showPage()

    # Page 9 — Applied English skills.
    compact_banner(c, "ENGLISH  •  APPLIED SKILLS", "VOCABULARY  •  READING  •  WRITING  •  SPEAKING", 9,
                   "book", PURPLE, CYAN)
    topic_card(c, 38, 588, PAGE_W-76, 162, ENGLISH[6]["title"], ENGLISH[6]["items"], ENGLISH[6]["icon"],
               accent=PURPLE, accent2=CYAN, columns=2)
    topic_card(c, 38, 438, PAGE_W-76, 130, ENGLISH[7]["title"], ENGLISH[7]["items"], ENGLISH[7]["icon"],
               accent=PURPLE, accent2=CYAN, columns=2)
    topic_card(c, 38, 274, PAGE_W-76, 144, ENGLISH[8]["title"], ENGLISH[8]["items"], ENGLISH[8]["icon"],
               accent=PURPLE, accent2=CYAN, columns=2)
    topic_card(c, 38, 144, PAGE_W-76, 110, ENGLISH[9]["title"], ENGLISH[9]["items"], ENGLISH[9]["icon"],
               accent=PURPLE, accent2=CYAN, columns=3, font_size=7.8)
    center_text(c, "READ  •  WRITE  •  SPEAK  •  GROW", PAGE_W/2, 84, "Poppins-SemiBold", 7.3, PURPLE)
    c.showPage()

    progress_page(c, 10, "English", len(ENGLISH), ENGLISH_TOPICS, "book", PURPLE, CYAN)

    # Page 11 — Closing achievement page.
    content_background(c, 11, dedication=True)
    gradient_round_rect(c, 38, 111, PAGE_W-76, 694, BLUE, PURPLE, 24, steps=140)
    c.saveState()
    alpha(c, .09)
    c.setFillColor(white)
    c.circle(65, 770, 90, stroke=0, fill=1)
    c.circle(PAGE_W-52, 160, 110, stroke=0, fill=1)
    c.circle(PAGE_W-20, 760, 55, stroke=0, fill=1)
    c.restoreState()
    c.setFillColor(white)
    c.circle(PAGE_W/2, 714, 43, stroke=0, fill=1)
    icon(c, "trophy", PAGE_W/2, 714, 39, BLUE)
    center_text(c, "ACADEMIC MILESTONE", PAGE_W/2, 649, "Poppins-Bold", 20, white)
    center_text(c, "SYLLABUS COMPLETION REPORT", PAGE_W/2, 625, "Poppins-SemiBold", 9, HexColor("#CFFAFE"))
    c.setStrokeColor(Color(1,1,1,alpha=.45))
    c.line(PAGE_W/2-110, 605, PAGE_W/2+110, 605)
    center_text(c, "THIS REPORT RECOGNIZES", PAGE_W/2, 573, "Poppins-SemiBold", 7, HexColor("#DBEAFE"))
    center_text(c, "MANSH SAHU", PAGE_W/2, 536, "Poppins-Bold", 27, white)
    center_text(c, "CLASS – 7", PAGE_W/2, 510, "Poppins-SemiBold", 9, HexColor("#E0E7FF"))
    center_text(c, "for completing the structured Mathematics and English syllabus", PAGE_W/2, 476,
                "Poppins-Medium", 8.2, white)

    # Centered completion summary cards.
    sw, gap = 143, 15
    sx = (PAGE_W - (sw*3 + gap*2))/2
    for x, val, label, kind, acc in [
        (sx, "2", "SUBJECTS", "book", BLUE),
        (sx+sw+gap, str(TOTAL_TOPICS), "TOPICS COVERED", "check", PURPLE),
        (sx+(sw+gap)*2, "100%", "COMPLETED", "target", CYAN),
    ]:
        c.setFillColor(white)
        c.setStrokeColor(Color(1, 1, 1, alpha=.55))
        c.setLineWidth(.7)
        c.roundRect(x, 352, sw, 94, 14, stroke=1, fill=1)
        c.setFillColor(tint(acc, .90))
        c.circle(x+sw/2, 421, 14, stroke=0, fill=1)
        icon(c, kind, x+sw/2, 421, 14, acc)
        center_text(c, val, x+sw/2, 384, "Poppins-Bold", 18, NAVY)
        center_text(c, label, x+sw/2, 368, "Poppins-SemiBold", 6.2, MUTED)

    center_text(c, "Prepared By", PAGE_W/2, 305, "Poppins-SemiBold", 7, HexColor("#CFFAFE"))
    center_text(c, "Naveen Kashyap", PAGE_W/2, 278, "Poppins-Bold", 14, white)
    center_text(c, "MERN Stack Developer & Educator", PAGE_W/2, 258, "Poppins", 7.4, HexColor("#E0E7FF"))
    c.setStrokeColor(Color(1,1,1,alpha=.42))
    c.line(PAGE_W/2-92, 234, PAGE_W/2+92, 234)
    center_text(c, "Prepared with dedication for the student's learning journey.", PAGE_W/2, 205,
                "Poppins-Medium", 7.4, white)
    center_text(c, "© 2026 Naveen Kashyap", PAGE_W/2, 177, "Poppins", 6.8, HexColor("#DBEAFE"))
    c.showPage()

    c.save()
    print(f"Created: {OUT}")
    print(f"Mathematics topics: {MATH_TOPICS}")
    print(f"English topics: {ENGLISH_TOPICS}")
    print(f"Total topics: {TOTAL_TOPICS}")


if __name__ == "__main__":
    build_pdf()
