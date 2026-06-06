"""
Seed script — inserts 80 realistic Indian leads for user_id=1 (dipesh@rag.com)
Run: venv\Scripts\python.exe seed_leads.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, timedelta
import random

from app.db.database import SessionLocal
from app.db.models import Lead

LEADS = [
    # ─── Real Estate ───────────────────────────────────────────────────────────
    {"name": "Ramesh Gupta",        "email": "ramesh.gupta@gmail.com",     "phone": "9876543210", "company": "Gupta Builders",          "status": "hot",  "source": "indiamart",  "notes": "Looking for 3BHK in Andheri West. Budget 85L. Wife approval pending. Ready to close Q1. Wants modular kitchen."},
    {"name": "Priya Sharma",        "email": "priya.sharma@yahoo.com",     "phone": "9823456789", "company": "Self",                    "status": "warm", "source": "99acres",    "notes": "2BHK for investment, budget 55-60L. Prefers Thane or Navi Mumbai. Rental yield important. Follow up after Diwali."},
    {"name": "Arjun Patel",         "email": "arjun.patel@hotmail.com",    "phone": "9712345678", "company": "Patel Developers",        "status": "hot",  "source": "referral",   "notes": "Commercial office space needed, 2000 sqft min. Budget flexible up to 2Cr. Wants Bandra-Kurla Complex location. Decision in 3 weeks."},
    {"name": "Sunita Verma",        "email": "sunita.verma@gmail.com",     "phone": "9654321098", "company": "Verma Real Estate",       "status": "cold", "source": "website",    "notes": "Enquired about villa plots in Lonavala. Budget 40L. Not urgent, planning for retirement. Call back in 6 months."},
    {"name": "Vikram Singh",        "email": "vikram.singh@outlook.com",   "phone": "9543210987", "company": "Singh Properties",        "status": "warm", "source": "whatsapp",   "notes": "Wants to sell existing 2BHK and upgrade to 4BHK. Saaki Naka area preferred. Timeline 6 months. Needs help with loan."},
    {"name": "Kavya Reddy",         "email": "kavya.reddy@gmail.com",      "phone": "9432109876", "company": "Reddy Infra",             "status": "hot",  "source": "indiamart",  "notes": "Ready to book 3BHK in Hyderabad Gachibowli. Budget 70L. Home loan pre-approved from SBI. Wants possession by Dec 2025."},
    {"name": "Mohan Krishnamurthy", "email": "mohan.km@gmail.com",         "phone": "9321098765", "company": "KM Constructions",        "status": "warm", "source": "linkedin",   "notes": "Looking for commercial space in Bangalore Whitefield. IT company expanding. 5000 sqft needed. Budget 1.5-2Cr. Meeting next Tuesday."},
    {"name": "Anita Joshi",         "email": "anita.joshi@rediffmail.com", "phone": "9210987654", "company": "Joshi Family",            "status": "cold", "source": "cold-call",  "notes": "1BHK in Pune Kothrud area. Budget 35L. First-time buyer, needs guidance. Husband not convinced yet. Very price sensitive."},
    {"name": "Deepak Agarwal",      "email": "deepak.agarwal@gmail.com",   "phone": "9109876543", "company": "Agarwal Group",           "status": "hot",  "source": "event",      "notes": "Met at property expo. Wants row house in Ahmedabad. Budget 1.2Cr. Cash ready. Decision by end of month. Very serious buyer."},
    {"name": "Meena Pillai",        "email": "meena.pillai@gmail.com",     "phone": "8998765432", "company": "Self",                    "status": "warm", "source": "website",    "notes": "NRI returning from Dubai. Looking for 3BHK in Kochi. Budget 80L. Will visit India next month. Wants smart home features."},

    # ─── Insurance ─────────────────────────────────────────────────────────────
    {"name": "Rajesh Nair",         "email": "rajesh.nair@gmail.com",      "phone": "8887654321", "company": "Nair & Co",               "status": "hot",  "source": "referral",   "notes": "Term insurance 1Cr sum assured. Age 34, non-smoker, healthy. Referred by Suresh. Ready to pay premium. Just needs final comparison between LIC and HDFC."},
    {"name": "Shalini Dubey",       "email": "shalini.dubey@yahoo.com",    "phone": "8776543210", "company": "Dubey Textiles",          "status": "warm", "source": "whatsapp",   "notes": "Health insurance family floater for 4 members. Budget 15000/year. Father has diabetes so needs pre-existing coverage. Follow up with Bajaj Allianz quote."},
    {"name": "Kiran Mehta",         "email": "kiran.mehta@gmail.com",      "phone": "8665432109", "company": "Mehta Motors",            "status": "hot",  "source": "indiamart",  "notes": "Business owner needs key-man insurance and group mediclaim for 25 employees. Budget 2L/year. Very motivated. Wants to close this quarter."},
    {"name": "Pooja Tiwari",        "email": "pooja.tiwari@gmail.com",     "phone": "8554321098", "company": "Self",                    "status": "cold", "source": "website",    "notes": "Child education plan for 5-year-old. Budget 3000/month. Husband doesn't believe in insurance. Low priority right now."},
    {"name": "Sandeep Kulkarni",    "email": "sandeep.k@gmail.com",        "phone": "8443210987", "company": "Kulkarni Engineering",    "status": "warm", "source": "linkedin",   "notes": "ULIP investment cum insurance. Has surplus 1L to invest. Age 41. Comparing with mutual funds. Need to explain benefits clearly. Second meeting scheduled."},
    {"name": "Geeta Iyer",          "email": "geeta.iyer@rediffmail.com",  "phone": "8332109876", "company": "Iyer Family",             "status": "hot",  "source": "cold-call",  "notes": "Senior citizen health plan for parents aged 68 and 72. Budget flexible. Son is paying. Ready to proceed once medical checkup approved. Very urgent."},
    {"name": "Amit Saxena",         "email": "amit.saxena@gmail.com",      "phone": "8221098765", "company": "Saxena Pharma",           "status": "warm", "source": "event",      "notes": "Critical illness cover 50L. Has family history of heart disease. Age 38. Comparing Star Health vs Niva Bupa. Price sensitive. Needs 1 more week."},

    # ─── EdTech / Coaching ──────────────────────────────────────────────────────
    {"name": "Rohit Yadav",         "email": "rohit.yadav@gmail.com",      "phone": "8110987654", "company": "Self",                    "status": "hot",  "source": "website",    "notes": "Wants full-stack web dev bootcamp. Currently working in BPO. Budget 25000. Can start immediately. Needs job placement guarantee. Very motivated."},
    {"name": "Neha Gupta",          "email": "neha.gupta@gmail.com",       "phone": "7999876543", "company": "Self",                    "status": "hot",  "source": "linkedin",   "notes": "MBA working professional. Wants data science course with Python. Budget 40000. Can do weekend batches only. Wants certificate from IIT/IIM collaboration."},
    {"name": "Suresh Babu",         "email": "suresh.babu@yahoo.com",      "phone": "7888765432", "company": "Babu Tutorials",          "status": "warm", "source": "referral",   "notes": "Running coaching centre, wants to go online. EdTech white-label platform needed. 200 students currently. Revenue 3L/month. Tech-savvy but needs support."},
    {"name": "Pallavi Desai",       "email": "pallavi.desai@gmail.com",    "phone": "7777654321", "company": "Self",                    "status": "cold", "source": "indiamart",  "notes": "UPSC preparation course for daughter. Budget 15000. Daughter not fully committed. Mom is the decision maker. Follow up next month."},
    {"name": "Manish Chauhan",      "email": "manish.chauhan@gmail.com",   "phone": "7666543210", "company": "Chauhan Academy",         "status": "hot",  "source": "whatsapp",   "notes": "10 seats corporate training on AI/ML for his company team. Budget 5L total. Decision maker, can sign PO this week. Batch of 10 engineers."},
    {"name": "Divya Nambiar",       "email": "divya.nambiar@gmail.com",    "phone": "7555432109", "company": "Self",                    "status": "warm", "source": "website",    "notes": "CA final student needs revision batch. Budget 8000. Exam in May. Time pressure is a motivator. Comparing 3 institutes. Price is deciding factor."},
    {"name": "Yash Tripathi",       "email": "yash.tripathi@gmail.com",    "phone": "7444321098", "company": "Self",                    "status": "warm", "source": "cold-call",  "notes": "Graphic design course. Fresher. Budget 12000. Parents paying. Wants Adobe certified curriculum. Sibling also interested if price is right."},
    {"name": "Riya Kapoor",         "email": "riya.kapoor@hotmail.com",    "phone": "7333210987", "company": "Self",                    "status": "cold", "source": "event",      "notes": "Digital marketing course. Currently in 12th standard. Will decide after board exams. Low urgency. Add to drip campaign."},

    # ─── IT / Digital Agency ────────────────────────────────────────────────────
    {"name": "Vivek Anand",         "email": "vivek.anand@techstartup.in", "phone": "7222109876", "company": "TechFlow Pvt Ltd",        "status": "hot",  "source": "linkedin",   "notes": "Needs custom CRM development. Budget 4-6L. Timeline 3 months. Has existing Excel-based system. 15 person sales team. Meeting with CTO next week."},
    {"name": "Shruti Pandey",       "email": "shruti.pandey@gmail.com",    "phone": "7111098765", "company": "Pandey Digital",          "status": "warm", "source": "referral",   "notes": "SEO + content marketing retainer. D2C brand selling ayurvedic products. Monthly budget 50000. Currently with another agency, not happy. Wants proposal."},
    {"name": "Aakash Malhotra",     "email": "aakash.m@malhotragroup.com", "phone": "7000987654", "company": "Malhotra Group",          "status": "hot",  "source": "event",      "notes": "Complete digital transformation project. Manufacturing company 500Cr turnover. Budget 25-30L. Board approved. Need project start date ASAP."},
    {"name": "Preeti Bhatia",       "email": "preeti.bhatia@gmail.com",    "phone": "6999876543", "company": "Bhatia Retail",           "status": "warm", "source": "indiamart",  "notes": "E-commerce website development. Retail shop wants to go online post-COVID. Budget 80000. Basic Shopify setup needed. Comparing 5 agencies."},
    {"name": "Nitin Jaiswal",       "email": "nitin.jaiswal@startup.io",   "phone": "6888765432", "company": "QuickDeliver",            "status": "hot",  "source": "linkedin",   "notes": "Mobile app development for on-demand delivery startup. Raised seed funding 50L. Budget for app 15L. Wants React Native. Founder very decisive."},
    {"name": "Rekha Srivastava",    "email": "rekha.sriv@gmail.com",       "phone": "6777654321", "company": "Srivastava & Partners",   "status": "cold", "source": "website",    "notes": "Law firm website redesign. Old static site. Budget 25000. Partner who makes decisions is travelling. Follow up in 2 weeks."},
    {"name": "Harish Goel",         "email": "harish.goel@goeltech.com",   "phone": "6666543210", "company": "Goel Tech Solutions",     "status": "warm", "source": "referral",   "notes": "Cloud migration from on-premise to AWS. Mid-size manufacturing firm. IT head Harish is the champion but CFO approval needed. Budget 8-12L/year."},
    {"name": "Tanya Khanna",        "email": "tanya.khanna@fashionco.in",  "phone": "6555432109", "company": "TrendZ Fashion",          "status": "hot",  "source": "instagram",  "notes": "Instagram and Facebook ad management. Fashion brand 3Cr revenue. Current ROAS 1.8x, wants 3x. Budget 1.5L/month ads + 30K management fee. Ready to start."},
    {"name": "Sanjay Mishra",       "email": "sanjay.mishra@gmail.com",    "phone": "6444321098", "company": "Mishra Industries",       "status": "warm", "source": "indiamart",  "notes": "ERP implementation for trading company. SAP vs Zoho vs custom. 50 employees. Budget 5-8L. Process documentation not done yet. Slow mover."},

    # ─── Staffing / HR ──────────────────────────────────────────────────────────
    {"name": "Farida Khan",         "email": "farida.khan@hrfirm.in",      "phone": "6333210987", "company": "Khan HR Solutions",       "status": "hot",  "source": "linkedin",   "notes": "Bulk hiring 50 BPO agents for Pune. Client is a fintech startup. Timeline 30 days. Has done bulk hiring before. Payment terms NET 45."},
    {"name": "Ganesh Rao",          "email": "ganesh.rao@techrecruit.com", "phone": "6222109876", "company": "TechRecruit India",       "status": "warm", "source": "referral",   "notes": "Need 5 senior React developers for 6-month contract. Budget 80K/month per resource. Startup expanding team post Series A. Background check required."},
    {"name": "Lalita Fernandez",    "email": "lalita.f@gmail.com",         "phone": "6111098765", "company": "Fernandez Consulting",    "status": "hot",  "source": "event",      "notes": "Executive search for VP Sales role. FMCG company. CTC budget 40-50L. Confidential search. 30-day timeline. Referral bonus confirmed."},
    {"name": "Prakash Hegde",       "email": "prakash.hegde@staffco.in",   "phone": "6000987654", "company": "StaffCo",                 "status": "cold", "source": "cold-call",  "notes": "Payroll outsourcing for 200-person company. Currently doing in-house. Budget not finalised. HR manager interested but MD not convinced. Long sales cycle."},
    {"name": "Usha Menon",          "email": "usha.menon@menoncorp.com",   "phone": "9876512345", "company": "Menon Corporation",       "status": "warm", "source": "website",    "notes": "Compliance and statutory HR services. Kerala based manufacturing unit. 150 workers. PF, ESIC management needed. Wants monthly retainer model."},

    # ─── SaaS / Startup ─────────────────────────────────────────────────────────
    {"name": "Akshay Bhatt",        "email": "akshay.bhatt@saasventure.io","phone": "9765432101", "company": "SaasVenture",             "status": "hot",  "source": "linkedin",   "notes": "Wants custom AI chatbot for customer support. SaaS company 500 customers. Budget 3-5L one-time. Has GPT API key. Timeline 6 weeks. Very technical buyer."},
    {"name": "Bhavna Solanki",      "email": "bhavna.s@ecomstore.in",      "phone": "9654321012", "company": "QuickCart",               "status": "warm", "source": "indiamart",  "notes": "Recommendation engine for e-commerce. 50000 SKUs. Wants higher AOV. Budget 2L. Has existing Shopify store. Tech team is 2 people."},
    {"name": "Chetan Borkar",       "email": "chetan.borkar@startup.com",  "phone": "9543210123", "company": "FinEase",                 "status": "hot",  "source": "event",      "notes": "Fintech startup needs lending platform backend development. Raised 2Cr seed. CTO is technical. Budget 20L for v1. Wants to launch in 4 months."},
    {"name": "Deepti Wagh",         "email": "deepti.wagh@gmail.com",      "phone": "9432101234", "company": "HealthFirst",             "status": "warm", "source": "referral",   "notes": "Telemedicine platform development. Doctor network 200 doctors. Post-COVID opportunity. Budget 8-12L. Regulatory compliance (NMC) is a concern. Needs legal clarity first."},
    {"name": "Esha Rastogi",        "email": "esha.rastogi@logico.in",     "phone": "9321012345", "company": "LogiCo",                  "status": "cold", "source": "website",    "notes": "Logistics tracking SaaS. Fleet of 50 trucks. Currently using WhatsApp for tracking. Budget 10000/month max. Very price sensitive. Needs convincing."},

    # ─── Miscellaneous / Diverse ────────────────────────────────────────────────
    {"name": "Faisal Sheikh",       "email": "faisal.sheikh@trademart.com","phone": "9210123456", "company": "TradeMart Exports",       "status": "hot",  "source": "indiamart",  "notes": "Export documentation software. Textile exporter, 15Cr revenue. Currently all manual. Budget 50000/year. Decision very soon. Accountant is the champion."},
    {"name": "Gita Saha",           "email": "gita.saha@saha.co",          "phone": "9109234567", "company": "Saha & Associates",       "status": "warm", "source": "linkedin",   "notes": "Tax filing and accounting software for CA firm. 300 clients. Currently Tally. Wants cloud solution. Budget 2000/month. 3 partners need to agree."},
    {"name": "Hemant Patil",        "email": "hemant.patil@gmail.com",     "phone": "9008345678", "company": "Patil Agro",              "status": "cold", "source": "cold-call",  "notes": "Farm management app for cooperative. 500 farmer members. Government grant possible. Very slow decision making. Check back in 2 months."},
    {"name": "Isha Kapadia",        "email": "isha.kapadia@fashionista.in","phone": "8907456789", "company": "Fashionista Studio",      "status": "hot",  "source": "instagram",  "notes": "Influencer marketing platform access. Fashion brand 1Cr revenue. Wants micro-influencer campaigns. Budget 80K/month. Creative brief ready. Quick decision."},
    {"name": "Jayesh Thakkar",      "email": "jayesh.thakkar@thakkar.biz","phone": "8806567890", "company": "Thakkar Jewellers",       "status": "warm", "source": "event",      "notes": "Gold loan CRM and customer management system. Jewellery shop 3 branches. 1500 customers. Budget 1.5L one-time. Tech not priority but son pushing for digital."},
    {"name": "Kavita Banerjee",     "email": "kavita.b@ngo.org",           "phone": "8705678901", "company": "Samridhi Foundation",     "status": "cold", "source": "website",    "notes": "NGO donor management CRM. 10000 donors. Grant funding dependent. Budget approval in March. Wants open-source solution if possible. Price very sensitive."},
    {"name": "Lokesh Sharma",       "email": "lokesh.sharma@mediaco.in",   "phone": "8604789012", "company": "MediaCo",                 "status": "hot",  "source": "referral",   "notes": "Video production company needs project management tool custom built. 20 person team. Budget 2L. Has existing workflow. Wants integration with Google Drive."},
    {"name": "Madhu Krishnan",      "email": "madhu.k@spicetraders.com",   "phone": "8503890123", "company": "Spice Traders India",     "status": "warm", "source": "indiamart",  "notes": "B2B marketplace listing and lead gen. Spice exporter. 5Cr annual. Wants to find international buyers. Export marketing budget 3L/year."},
    {"name": "Naresh Choudhary",    "email": "naresh.c@gmail.com",         "phone": "8402901234", "company": "Choudhary Construction",  "status": "hot",  "source": "whatsapp",   "notes": "Construction project management software. 8 active sites in Rajasthan. Labour tracking and material management. Budget 1.5L. Very interested, demo done."},
    {"name": "Omkar Rane",          "email": "omkar.rane@autopart.in",     "phone": "8302012345", "company": "Rane Auto Parts",         "status": "warm", "source": "indiamart",  "notes": "Inventory management for auto parts distributor. 5000 SKUs, 3 warehouses. Budget 3-4L. Evaluating 3 vendors. Decision in 15 days. Follow up with case study."},
    {"name": "Pallavi Shinde",      "email": "pallavi.shinde@gmail.com",   "phone": "8201123456", "company": "Shinde Clinic",           "status": "hot",  "source": "referral",   "notes": "Hospital management system for 50-bed hospital in Kolhapur. OPD + billing + pharmacy. Budget 3L. Owns the place, quick decision. Demo next Friday."},

    # ─── More varied signals ────────────────────────────────────────────────────
    {"name": "Qasim Ali",           "email": "qasim.ali@alitradeco.com",   "phone": "8100234567", "company": "Ali Trade Co",            "status": "cold", "source": "cold-call",  "notes": "Import-export tracking. Seasonal business. Budget uncertain. Call back in August when season starts."},
    {"name": "Rekha Jha",           "email": "rekha.jha@eduinstitute.in",  "phone": "7999345678", "company": "Gyandeep Institute",      "status": "warm", "source": "website",    "notes": "School ERP for 1200 student school. Wants fee management, attendance, report cards. Budget 80K/year. Principal is excited, trustee approval pending."},
    {"name": "Sujit Dey",           "email": "sujit.dey@sujitdey.com",     "phone": "7898456789", "company": "Dey Photography",         "status": "cold", "source": "instagram",  "notes": "CRM for wedding photography business. 60 bookings/year. Budget very low 2000/month max. Just wants WhatsApp + calendar. Not a serious prospect."},
    {"name": "Tejaswini Kulkarni",  "email": "tejaswinijk@gmail.com",      "phone": "7797567890", "company": "Kulkarni Legal",          "status": "warm", "source": "linkedin",   "notes": "Legal practice management software. 5 lawyers, 300 active cases. Currently MS Word and email. Budget 30K/year. Partner meeting on 15th."},
    {"name": "Ujwal Ghosh",         "email": "ujwal.ghosh@ghoshfoods.com", "phone": "7696678901", "company": "Ghosh Foods",             "status": "hot",  "source": "indiamart",  "notes": "Food delivery app with vendor management. Cloud kitchen 5 brands. Wants custom app, not Swiggy/Zomato margin. Budget 6L. Very motivated, timeline 3 months."},
    {"name": "Vandana Tomar",       "email": "vandana.tomar@realestate.in","phone": "7595789012", "company": "Tomar Realty",            "status": "warm", "source": "99acres",    "notes": "CRM for real estate agency 15 agents. Lead management + site visit tracking. Budget 5000/month. Evaluating Salesforce vs custom. Wants India-specific features."},
    {"name": "Waqas Siddiqui",      "email": "waqas.s@siddiquitraders.in", "phone": "7494890123", "company": "Siddiqui Traders",        "status": "cold", "source": "manual",     "notes": "Wholesale distributor wants order management app. Very traditional business. Owner not tech-savvy. Son is the champion but no authority. Long conversion."},
    {"name": "Xerxes Irani",        "email": "xerxes.irani@iranigroup.com","phone": "7393901234", "company": "Irani Group",             "status": "hot",  "source": "referral",   "notes": "Business intelligence dashboard for group of 5 companies. CFO level requirement. Budget 10-15L. Very decisive. Wants pilot in 30 days."},
    {"name": "Yogita Soni",         "email": "yogita.soni@sonibeauty.com", "phone": "7293012345", "company": "Soni Beauty Parlour",     "status": "warm", "source": "instagram",  "notes": "Salon management software chain of 8 salons. 50000 customers. Appointment booking + loyalty program. Budget 8000/month. Demo was positive. Price negotiation stage."},
    {"name": "Zara Hussain",        "email": "zara.hussain@boutique.in",   "phone": "7192123456", "company": "Zara Boutique",           "status": "cold", "source": "instagram",  "notes": "Online boutique wants custom website + WhatsApp catalogue. Budget 15000 only. Very small business. Mostly window shopping."},
    {"name": "Ashok Swaminathan",   "email": "ashok.swami@swamicorp.com",  "phone": "9812345670", "company": "Swami Corporation",       "status": "hot",  "source": "event",      "notes": "EV charging station management software. 50 stations across Karnataka. Govt contract. Budget 20L. Tender process. Needs white-label solution. Urgent."},
    {"name": "Bharat Lal",          "email": "bharat.lal@blgroup.in",      "phone": "9701234561", "company": "BL Group",                "status": "warm", "source": "referral",   "notes": "Cement dealer wants dealer management system. 200 dealers across UP. Excel-based now. Budget 2-3L. VP Sales is champion. MD needs 1 more demo."},
    {"name": "Chhaya Mehrotra",     "email": "chhaya.m@mehrotraclinic.in", "phone": "9590123452", "company": "Mehrotra Dental Clinic",  "status": "warm", "source": "website",    "notes": "Patient management for 3-doctor dental clinic. Appointment reminders, payment tracking. Budget 3000/month. Technically savvy doctor."},
    {"name": "Dinesh Oza",          "email": "dinesh.oza@ozafinance.com",  "phone": "9479012343", "company": "Oza Finance",             "status": "hot",  "source": "whatsapp",   "notes": "NBFC wants loan origination system. 5000 active loan accounts. Budget 8-12L. Regulatory requirement driving urgency. Need to go live in 60 days."},
    {"name": "Eknath Bhosale",      "email": "eknath.b@bhosaleagri.in",    "phone": "9368901234", "company": "Bhosale Agri",            "status": "cold", "source": "cold-call",  "notes": "Agri input dealer wants customer app. 3000 farmer customers. Very budget conscious. Wants free tier. Not a qualified prospect unless govt subsidy."},
    {"name": "Falguni Trivedi",     "email": "falguni.t@trivedievents.in", "phone": "9257890125", "company": "Trivedi Events",          "status": "warm", "source": "linkedin",   "notes": "Event management company wants vendor and client CRM. 100 events/year. Budget 40K/year. Sales manager Falguni is decision maker. Proposal sent, awaiting feedback."},
    {"name": "Gautam Roy",          "email": "gautam.roy@roylogistics.in", "phone": "9146789016", "company": "Roy Logistics",           "status": "hot",  "source": "indiamart",  "notes": "Fleet management for 120 trucks. Real-time GPS + driver management + fuel tracking. Budget 5L/year. Very clear requirements. POC approved. Move to contract."},
    {"name": "Harsha Reddy",        "email": "harsha.reddy@hreddy.com",    "phone": "9035678907", "company": "H. Reddy & Co",           "status": "warm", "source": "referral",   "notes": "Chartered accountant wants client management portal. 180 clients, 4 staff. Document sharing + task tracking. Budget 2000/month. Comparing 3 tools. Price matters."},
    {"name": "Ishaan Kapoor",       "email": "ishaan.k@kapoorstudio.in",   "phone": "8924567898", "company": "Kapoor Architecture",     "status": "cold", "source": "website",    "notes": "Architecture firm wants project management tool. 8 architects. Very early stage research. Not ready to buy for 3-6 months."},
    {"name": "Jasmine D'Souza",     "email": "jasmine.dsouza@gmail.com",   "phone": "8813456789", "company": "D'Souza Healthcare",      "status": "hot",  "source": "event",      "notes": "Home healthcare startup. 500 nurses, 2000 patients. Scheduling + patient management. Raised 3Cr Series A. Budget 15L for software. CTO evaluating. Very close."},
]

def main():
    db = SessionLocal()
    try:
        # Remove existing leads for user 1 to avoid duplicates
        existing = db.query(Lead).filter(Lead.user_id == 1).count()
        print(f"Existing leads for user 1: {existing}")

        existing_emails = {e for (e,) in db.query(Lead.email).filter(Lead.user_id == 1).all()}
        inserted = 0
        skipped = 0
        base_date = datetime(2025, 9, 1)

        for i, d in enumerate(LEADS):
            if d["email"] in existing_emails:
                skipped += 1
                continue
            created = base_date + timedelta(days=random.randint(0, 240))
            lead = Lead(
                user_id=1,
                name=d["name"],
                email=d["email"],
                phone=d.get("phone", ""),
                company=d.get("company", ""),
                status=d["status"],
                source=d.get("source", "manual"),
                notes=d["notes"],
                created_at=created,
                updated_at=created,
            )
            db.add(lead)
            existing_emails.add(d["email"])
            inserted += 1

        db.commit()
        print(f"Skipped {skipped} duplicates")
        print(f"[OK] Inserted {inserted} leads for user_id=1")
        print("Now run the vectorstore sync to index them:")
        print("  POST /api/v1/ingest/sync  (from the app Settings page)")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
