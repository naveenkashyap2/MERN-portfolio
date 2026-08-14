from pathlib import Path
from math import ceil, cos, sin, pi
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

OUT = Path(__file__).with_name("Mansh_Sahu_Academic_Progress_Report.pdf")
W, H = A4
BLUE = HexColor("#2563EB")
PURPLE = HexColor("#7C3AED")
CYAN = HexColor("#06B6D4")
NAVY = HexColor("#0F172A")
SLATE = HexColor("#475569")
MUTED = HexColor("#64748B")
PALE = HexColor("#F8FAFC")
BORDER = HexColor("#E2E8F0")
GREEN = HexColor("#10B981")

font_dir = Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("Inter", str(font_dir / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("Inter-SemiBold", str(font_dir / "DejaVuSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Inter-Bold", str(font_dir / "DejaVuSans-Bold.ttf")))

math_parts = [
("PART 1", "Calculation Foundation", ["Tables (2–20)", "Reverse Tables", "Practice", "Multiplication Speed", "Addition", "Subtraction", "Multiplication", "Division", "Long Division", "BODMAS", "Mental Calculation", "Natural Numbers", "Whole Numbers", "Integers", "Positive & Negative Numbers", "Even & Odd Numbers"]),
("PART 2", "Squares & Cubes", ["Squares (1–50)", "Cubes (1–50)"]),
("PART 4", "HCF & LCM", ["Prime Factorization", "HCF", "LCM", "HCF using Division Method", "Word Problems", "Relationship between HCF & LCM"]),
("PART 5", "Ratio & Proportion", ["Ratio", "Equivalent Ratio", "Simplest Ratio", "Comparing Ratios", "Proportion"]),
("PART 6", "Percentage", ["Percentage Meaning", "Fraction → Percentage", "Decimal → Percentage", "Percentage → Fraction", "Percentage → Decimal"]),
("PART 7", "Profit & Loss", ["Cost Price (CP)", "Selling Price (SP)", "Profit", "Loss", "Profit %", "Loss %", "Basic Discount", ("Formulas", True), "Profit = SP − CP", "Loss = CP − SP", "Profit % = (Profit ÷ CP) × 100", "Loss % = (Loss ÷ CP) × 100"]),
("PART 8", "Algebra Basics", ["Variables", "Constants", "Terms", "Algebraic Expressions", "Simplification", "Addition of Expressions", "Subtraction of Expressions", "Multiplication of Expressions"]),
("PART 9", "Important Algebra Formulas", ["(a + b)²", "(a − b)²", "(a + b)(a − b)", "(x + a)(x + b)", "(x − a)(x − b)", "(x + a)(x − b)", "(a + b + c)²", "(a + b)³", "(a − b)³", "a³ + b³", "a³ − b³"]),
("PART 19", "Basic Speed, Time & Distance", ["Basic Word Problems", ("Formulas", True), "Speed = Distance ÷ Time", "Distance = Speed × Time", "Time = Distance ÷ Speed"]),
]

english_levels = [
("LEVEL 1", "Basic English Foundation", "GRAMMAR", ["A–Z", "Vowels & Consonants", "Word Formation", "Spelling", "Singular & Plural", "Common Vocabulary", "Word Meanings", "Noun", "Pronoun", "Verb", "Adjective", "Adverb", "Preposition", "Conjunction", "Interjection", "Articles / Determiners"]),
("LEVEL 2", "Sentence Formation", "WRITING", ["Sentence", "Subject", "Predicate", "Object", "Subject + Verb + Object", "Affirmative Sentence", "Negative Sentence", "Interrogative Sentence", "Imperative Sentence", "Exclamatory Sentence"]),
("LEVEL 3", "Tenses", "TIME", [("Present", True), "Simple Present", "Present Continuous", "Present Perfect", "Present Perfect Continuous", ("Past", True), "Simple Past", "Past Continuous", "Past Perfect", "Past Perfect Continuous", ("Future", True), "Simple Future", "Future Continuous", "Future Perfect", "Future Perfect Continuous"]),
("LEVEL 4", "Important Grammar", "GRAMMAR", [("Subject–Verb Agreement", True), "Singular Subject", "Plural Subject", "Is / Am / Are", "Was / Were", "Has / Have", "Do / Does", ("Articles", True), "A", "An", "The", "Zero Article", ("Prepositions", True), "In", "On", "At", "By", "With", "From", "To", "For", "Since", "During", "Between", "Among", "Under", "Over", "Behind", "Beside", ("Conjunctions", True), "And", "But", "Or", "Because", "Although", "If", "When", "While", "Unless", "So"]),
("LEVEL 5", "Advanced Grammar", "GRAMMAR", [("Modals", True), "Can", "Could", "May", "Might", "Must", "Should", "Would", "Shall", "Will", "Ought to", "Need", "Used to", ("Active & Passive Voice", True), "Present Tense", "Past Tense", "Future Tense", "Modal Verbs", ("Direct & Indirect Speech", True), "Statements", "Questions", "Commands", "Requests", "Tense Changes", "Pronoun Changes", "Time / Place Word Changes"]),
("LEVEL 6", "Sentence Transformation", "WRITING", [("Question Formation", True), "What", "Why", "When", "Where", "Who", "Whom", "Which", "Whose", "How", ("Sentence Transformation", True), "Affirmative → Negative", "Statement → Question", "Simple → Compound", "Compound → Complex", ("Clauses", True), "Noun Clause", "Adjective Clause", "Adverb Clause", ("Conditionals", True), "Zero Conditional", "First Conditional", "Second Conditional", "Third Conditional"]),
("LEVEL 7", "Vocabulary", "VOCAB", ["Synonyms", "Antonyms", "One-Word Substitution", "Homophones", "Homonyms", "Prefix", "Suffix", "Idioms & Phrases", "Phrasal Verbs", "Common Confusing Words", "Word Formation"]),
("LEVEL 8", "Reading Skills", "READING", ["Loud Reading", "Silent Reading", "Unseen Passage", "Reading Comprehension", "Finding Answers", "Vocabulary from Passage"]),
("LEVEL 9", "Writing Skills", "WRITING", ["Paragraph Writing", "Application Writing", "Letter Writing", "Essay Writing", "Story Writing", "Notice Writing", "Message Writing"]),
("LEVEL 10", "Speaking English", "SPEAKING", ["Self Introduction", "Daily Conversation", "Topic Speaking"]),
]

def is_header(x): return isinstance(x, tuple)
def topic_count(items): return sum(1 for x in items if not is_header(x))
MATH_COUNT = sum(topic_count(x[2]) for x in math_parts)
ENGLISH_COUNT = sum(topic_count(x[3]) for x in english_levels)
TOTAL = MATH_COUNT + ENGLISH_COUNT


def lerp(a, b, t): return Color(a.red+(b.red-a.red)*t, a.green+(b.green-a.green)*t, a.blue+(b.blue-a.blue)*t)
def gradient(c, x, y, w, h, a=BLUE, b=PURPLE, steps=80):
    sw = w / steps
    for i in range(steps):
        c.setFillColor(lerp(a, b, i/(steps-1)))
        c.rect(x+i*sw, y, sw+0.8, h, stroke=0, fill=1)

def rounded(c, x, y, w, h, radius=14, fill=white, stroke=BORDER, shadow=True):
    if shadow:
        c.saveState(); c.setFillColor(Color(0.06,0.09,0.16,alpha=.07)); c.roundRect(x+2,y-3,w,h,radius,0,1); c.restoreState()
    c.setFillColor(fill); c.setStrokeColor(stroke); c.setLineWidth(.7); c.roundRect(x,y,w,h,radius,1,1)

def text(c, s, x, y, size=10, font="Inter", color=NAVY, align="center"):
    c.setFillColor(color); c.setFont(font,size)
    {"center":c.drawCentredString,"left":c.drawString,"right":c.drawRightString}[align](x,y,s)

def pill(c, s, x, y, w, fill=Color(.93,.95,1), color=BLUE):
    c.setFillColor(fill); c.roundRect(x,y,w,20,10,0,1); text(c,s,x+w/2,y+6,7.5,"Inter-SemiBold",color)

def small_icon(c, x, y, label, color=BLUE):
    c.setFillColor(Color(color.red,color.green,color.blue,alpha=.12)); c.circle(x,y,15,0,1)
    c.setStrokeColor(color); c.setLineWidth(1.5); c.circle(x,y,10,1,0)
    text(c,label[:1],x,y-3.5,9,"Inter-Bold",color)

def footer(c, page):
    c.setStrokeColor(BORDER); c.line(48,31,W-48,31)
    text(c,"ACADEMIC PROGRESS REPORT",48,17,6.8,"Inter-SemiBold",MUTED,"left")
    text(c,"Prepared with dedication for the student's learning journey.",W/2,17,6.8,"Inter",MUTED)
    text(c,f"© 2026 Naveen Kashyap  •  {page:02d}",W-48,17,6.8,"Inter",MUTED,"right")

def page_heading(c, subject, subtitle, page_no, color1=BLUE, color2=PURPLE):
    gradient(c,0,H-105,W,105,color1,color2)
    c.setFillColor(Color(1,1,1,alpha=.13)); c.circle(W-34,H-10,75,0,1); c.circle(28,H-92,52,0,1)
    text(c,subject,W/2,H-54,20,"Inter-Bold",white)
    text(c,subtitle.upper(),W/2,H-76,8.2,"Inter-SemiBold",Color(1,1,1,alpha=.82))
    footer(c,page_no)

def draw_card(c, x, y, w, h, part, name, items, accent=BLUE, icon="∑", cols=None):
    rounded(c,x,y,w,h,15)
    bar_h=53
    c.saveState(); c.roundRect(x,y+h-bar_h,w,bar_h,15,0,0); c.clipPath(c.beginPath()) if False else None; c.restoreState()
    # rounded gradient title, followed by white mask to square lower corners
    c.saveState(); p=c.beginPath(); p.roundRect(x,y+h-bar_h,w,bar_h,15); c.clipPath(p,0,0); gradient(c,x,y+h-bar_h,w,bar_h,accent,PURPLE,55); c.restoreState()
    c.setFillColor(white); c.setFont("Inter-Bold",7.2); c.drawCentredString(x+w/2,y+h-17,part)
    c.setFont("Inter-Bold",12); c.drawCentredString(x+w/2,y+h-36,name)
    small_icon(c,x+28,y+h-26,icon,white)
    usable_h=h-bar_h-18
    n=len(items)
    if cols is None: cols = 1 if n<=9 else 2 if n<=24 else 3
    rows=ceil(n/cols)
    colw=(w-30)/cols
    lineh=min(17, max(11, (usable_h-6)/max(rows,1)))
    fs=8.5 if cols==1 else 7.6 if cols==2 else 6.8
    for i,item in enumerate(items):
        col=i//rows; row=i%rows
        cx=x+15+colw*(col+.5); yy=y+h-bar_h-18-row*lineh
        if is_header(item):
            text(c,item[0].upper(),cx,yy,fs-0.2,"Inter-Bold",accent)
            c.setStrokeColor(Color(accent.red,accent.green,accent.blue,alpha=.3)); c.line(cx-colw*.25,yy-3,cx+colw*.25,yy-3)
        else:
            text(c,"•  "+item,cx,yy,fs,"Inter",SLATE)

def progress(c, x, y, radius, label, accent=BLUE):
    c.setLineWidth(10); c.setStrokeColor(BORDER); c.circle(x,y,radius,1,0)
    segs=90
    for i in range(segs):
        a1=(90-i*360/segs)*pi/180; a2=(90-(i+1)*360/segs)*pi/180
        c.setStrokeColor(lerp(CYAN,accent,i/(segs-1))); c.setLineWidth(10)
        c.line(x+radius*cos(a1),y+radius*sin(a1),x+radius*cos(a2),y+radius*sin(a2))
    text(c,"100%",x,y-5,18,"Inter-Bold",NAVY)
    text(c,label.upper(),x,y-radius-27,7.5,"Inter-SemiBold",MUTED)

def cover(c):
    gradient(c,0,H-300,W,300,BLUE,PURPLE)
    c.setFillColor(Color(1,1,1,alpha=.10)); c.circle(W-20,H-10,120,0,1); c.circle(40,H-278,85,0,1)
    pill(c,"ACADEMIC YEAR • 2026",W/2-62,H-54,124,Color(1,1,1,alpha=.16),white)
    text(c,"MANSH SAHU",W/2,H-105,27,"Inter-Bold",white)
    text(c,"CLASS – 7",W/2,H-133,10,"Inter-SemiBold",Color(1,1,1,alpha=.86))
    text(c,"Academic Progress Report",W/2,H-173,18,"Inter-SemiBold",white)
    text(c,"MATHEMATICS & ENGLISH SYLLABUS COMPLETION REPORT",W/2,H-197,8.4,"Inter-SemiBold",Color(1,1,1,alpha=.82))
    c.setStrokeColor(Color(1,1,1,alpha=.55)); c.setLineWidth(1.2); c.line(W/2-120,H-216,W/2+120,H-216)
    text(c,"PREPARED BY",W/2,H-239,7,"Inter-SemiBold",Color(1,1,1,alpha=.7))
    text(c,"Naveen Kashyap",W/2,H-258,11,"Inter-Bold",white)
    text(c,"MERN Stack Developer & Educator",W/2,H-276,8,"Inter",Color(1,1,1,alpha=.8))

    text(c,"PROGRESS AT A GLANCE",W/2,H-336,9,"Inter-Bold",MUTED)
    stats=[("S","SUBJECTS","2",BLUE),("✓","TOPICS COVERED",str(TOTAL),CYAN),("T","COMPLETION STATUS","100%",PURPLE)]
    sw=156; gap=14; sx=(W-(3*sw+2*gap))/2
    for i,(ico,lab,val,col) in enumerate(stats):
        x=sx+i*(sw+gap); rounded(c,x,H-452,sw,94,14)
        small_icon(c,x+sw/2,H-383,ico,col)
        text(c,val,x+sw/2,H-414,17,"Inter-Bold",NAVY)
        text(c,lab,x+sw/2,H-437,6.7,"Inter-SemiBold",MUTED)

    y=104; boxh=250
    rounded(c,48,y,222,boxh,16)
    text(c,"COMPLETION SNAPSHOT",159,y+boxh-27,8,"Inter-Bold",MUTED)
    progress(c,159,y+128,55,"Overall Completion",PURPLE)
    text(c,f"{MATH_COUNT} Mathematics topics  •  {ENGLISH_COUNT} English topics",159,y+27,7,"Inter-SemiBold",SLATE)

    rounded(c,286,y,261,boxh,16)
    text(c,"STUDENT INFORMATION",416.5,y+boxh-27,8,"Inter-Bold",MUTED)
    fields=[("STUDENT NAME","Mansh Sahu"),("CLASS","7"),("SUBJECTS","Mathematics & English"),("STATUS","Completed"),("PREPARED BY","Naveen Kashyap")]
    yy=y+boxh-60
    for lab,val in fields:
        text(c,lab,416.5,yy,6.5,"Inter-SemiBold",MUTED)
        text(c,val,416.5,yy-16,9,"Inter-SemiBold",NAVY)
        yy-=37
    c.setStrokeColor(BLUE); c.setLineWidth(1.8); c.line(328,y+10,505,y+10)
    footer(c,1)
    c.showPage()

def subject_pages(c):
    # Math
    page_heading(c,"MATHEMATICS","A complete calculation, arithmetic and algebra roadmap",2)
    draw_card(c,48,374,W-96,335,*math_parts[0],BLUE,"∑",2)
    draw_card(c,48,145,W-96,190,*math_parts[1],CYAN,"²",1)
    text(c,"STRONG FOUNDATIONS • ACCURATE THINKING • CONFIDENT PROBLEM SOLVING",W/2,113,7.2,"Inter-SemiBold",MUTED); c.showPage()

    page_heading(c,"MATHEMATICS","Factors, ratios and percentage mastery",3)
    draw_card(c,48,515,W-96,194,*math_parts[2],BLUE,"×",1)
    draw_card(c,48,302,W-96,178,*math_parts[3],CYAN,"÷",1)
    draw_card(c,48,86,W-96,180,*math_parts[4],PURPLE,"%",1); c.showPage()

    page_heading(c,"MATHEMATICS","Commercial arithmetic and algebra essentials",4)
    draw_card(c,48,415,W-96,294,*math_parts[5],BLUE,"₹",2)
    draw_card(c,48,105,W-96,270,*math_parts[6],PURPLE,"x",2); c.showPage()

    page_heading(c,"MATHEMATICS","Formula fluency and real-world applications",5)
    draw_card(c,48,429,W-96,280,*math_parts[7],PURPLE,"ƒ",2)
    draw_card(c,48,185,W-96,208,*math_parts[8],CYAN,"→",1)
    progress(c,W/2,111,43,"Mathematics Completion",BLUE); c.showPage()

    # English
    page_heading(c,"ENGLISH","Language foundations and sentence confidence",6,CYAN,PURPLE)
    l=english_levels
    draw_card(c,48,390,W-96,319,l[0][0],l[0][1],l[0][3],CYAN,"G",2)
    draw_card(c,48,104,W-96,246,l[1][0],l[1][1],l[1][3],PURPLE,"W",2); c.showPage()

    page_heading(c,"ENGLISH","Tense control across present, past and future",7,CYAN,PURPLE)
    draw_card(c,48,169,W-96,540,l[2][0],l[2][1],l[2][3],BLUE,"T",2)
    text(c,"CLEAR TENSES CREATE CLEAR COMMUNICATION",W/2,123,7.4,"Inter-SemiBold",MUTED); c.showPage()

    page_heading(c,"ENGLISH","Core grammar for precise communication",8,CYAN,PURPLE)
    draw_card(c,48,100,W-96,609,l[3][0],l[3][1],l[3][3],PURPLE,"G",3); c.showPage()

    page_heading(c,"ENGLISH","Advanced grammar and reported expression",9,CYAN,PURPLE)
    draw_card(c,48,112,W-96,597,l[4][0],l[4][1],l[4][3],BLUE,"A",3); c.showPage()

    page_heading(c,"ENGLISH","Questions, clauses, conditionals and transformations",10,CYAN,PURPLE)
    draw_card(c,48,112,W-96,597,l[5][0],l[5][1],l[5][3],PURPLE,"Q",3); c.showPage()

    page_heading(c,"ENGLISH","Vocabulary depth and confident reading",11,CYAN,PURPLE)
    draw_card(c,48,398,W-96,311,l[6][0],l[6][1],l[6][3],BLUE,"V",2)
    draw_card(c,48,120,W-96,240,l[7][0],l[7][1],l[7][3],CYAN,"R",2); c.showPage()

    page_heading(c,"ENGLISH","Writing craft and spoken expression",12,CYAN,PURPLE)
    draw_card(c,48,455,W-96,254,l[8][0],l[8][1],l[8][3],PURPLE,"W",2)
    draw_card(c,48,270,W-96,150,l[9][0],l[9][1],l[9][3],CYAN,"S",1)
    progress(c,W/2,154,48,"English Completion",PURPLE)
    text(c,"COMPLETED WITH CONSISTENCY • READY FOR THE NEXT LEARNING MILESTONE",W/2,72,7.2,"Inter-SemiBold",MUTED)
    c.showPage()

def build():
    OUT.parent.mkdir(parents=True,exist_ok=True)
    c=canvas.Canvas(str(OUT),pagesize=A4,pageCompression=1)
    c.setTitle("Mansh Sahu — Academic Progress Report")
    c.setAuthor("Naveen Kashyap")
    c.setSubject("Class 7 Mathematics & English Syllabus Completion Report")
    cover(c); subject_pages(c); c.save()
    reader=PdfReader(str(OUT))
    assert len(reader.pages)==12
    assert TOTAL>0
    print(f"Created {OUT} | {len(reader.pages)} pages | {MATH_COUNT} mathematics + {ENGLISH_COUNT} English = {TOTAL} topics")

if __name__=="__main__": build()
