# GoatCounter Setup Instructions

GoatCounter is now integrated into MakeMyResume for simple, privacy-friendly analytics.

## Quick Setup (2 minutes)

### Step 1: Sign up for GoatCounter
1. Go to https://www.goatcounter.com
2. Click "Sign up" (it's FREE forever for personal use)
3. Choose a code like "makemyresume" 
4. Your analytics will be at: `makemyresume.goatcounter.com`

### Step 2: Configure Your App
Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_GOATCOUNTER_CODE=makemyresume
```

Replace `makemyresume` with your actual GoatCounter code.

### Step 3: Restart Dev Server
```bash
npm run dev
```

## What You Get

✅ **Page Views** - Track every page visit  
✅ **Referrers** - See where traffic comes from  
✅ **User Paths** - Understand user journey  
✅ **Real-time Stats** - Live visitor count  
✅ **Public Dashboard** - Your stats are visible to everyone at `yourcode.goatcounter.com`  
✅ **Privacy-First** - No cookies, GDPR compliant  
✅ **Lightweight** - Just 3.5KB script  

## View Your Stats

Visit: `https://yourcode.goatcounter.com`

## Optional: Make Stats Public

In your GoatCounter settings, enable "Public statistics" so visitors can see the stats too!

## No Signup?

If you don't want to sign up, the app will still work fine without analytics. Just don't create the `.env.local` file.

