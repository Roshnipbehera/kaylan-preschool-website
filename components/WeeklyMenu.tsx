"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Apple,
  ShieldCheck,
  Droplets,
  Heart,
  Sparkles,
  Download,
  Info,
} from "lucide-react";

interface MealSchedule {
  day: string;
  shortDay: string;
  morningSnack: {
    time: string;
    item: string;
    detail: string;
    nutritionTag: string;
  };
  lunch: {
    time: string;
    item: string;
    detail: string;
    nutritionTag: string;
  };
  eveningSnack: {
    time: string;
    item: string;
    detail: string;
    nutritionTag: string;
  };
}

const WEEKLY_MENU: MealSchedule[] = [
  {
    day: "Monday",
    shortDay: "Mon",
    morningSnack: {
      time: "10:15 AM",
      item: "Steamed Sweet Corn & Pomegranate",
      detail: "Lightly tossed with a pinch of cumin and rock salt, served with tender coconut water.",
      nutritionTag: "Antioxidants & Fiber",
    },
    lunch: {
      time: "12:30 PM",
      item: "Organic Moong Dal Khichdi & Carrot Raita",
      detail: "Slow-cooked organic rice and yellow lentils with ghee, accompanied by curd carrot raita and steamed beans.",
      nutritionTag: "High Protein & Probiotics",
    },
    eveningSnack: {
      time: "4:00 PM",
      item: "Roasted Foxnuts (Makhana) & Warm Milk",
      detail: "Ghee-roasted crispy makhana lightly seasoned with Himalayan pink salt, paired with organic cow's milk / ragi malt.",
      nutritionTag: "Calcium & Slow-Release Energy",
    },
  },
  {
    day: "Tuesday",
    shortDay: "Tue",
    morningSnack: {
      time: "10:15 AM",
      item: "Fresh Papaya & Banana Slices",
      detail: "Seasonal farm-fresh cut fruit bowl sprinkled with chia seeds, easy for little hands to pick.",
      nutritionTag: "Digestive Enzymes & Vitamin C",
    },
    lunch: {
      time: "12:30 PM",
      item: "Soft Roti Rolls with Mild Paneer Bhurji",
      detail: "Handmade whole-wheat phulkas stuffed with cottage cheese, mild spinach, and sweet corn alongside vegetable soup.",
      nutritionTag: "Iron & Muscle Development",
    },
    eveningSnack: {
      time: "4:00 PM",
      item: "Steamed Vegetable Idli & Coconut Chutney",
      detail: "Mini bite-sized fermented rice-urad idlis infused with grated beetroot and mild coconut dip.",
      nutritionTag: "Gut Health & Iron Boost",
    },
  },
  {
    day: "Wednesday",
    shortDay: "Wed",
    morningSnack: {
      time: "10:15 AM",
      item: "Apple Wedges & Soaked Raisins",
      detail: "Crisp Himalayan apple slices with soaked golden raisins, supporting natural stamina.",
      nutritionTag: "Natural Sugars & Pectin",
    },
    lunch: {
      time: "12:30 PM",
      item: "Jeera Pulao, Yellow Dal Tadka & Cucumber Salad",
      detail: "Aromatic cumin-infused organic rice paired with mild toor dal, steamed green peas, and diced cucumber.",
      nutritionTag: "Complex Carbs & Plant Protein",
    },
    eveningSnack: {
      time: "4:00 PM",
      item: "Whole Wheat Banana Bread / Pancake",
      detail: "Freshly baked in-house with ripe bananas and jaggery (100% white-sugar free).",
      nutritionTag: "Zero Refined Sugar & Potassium",
    },
  },
  {
    day: "Thursday",
    shortDay: "Thu",
    morningSnack: {
      time: "10:15 AM",
      item: "Steamed Sprouted Moong Chaat",
      detail: "Mildly steamed sprouted green gram with grated cucumber, sweet tomatoes, and a squeeze of fresh lemon.",
      nutritionTag: "Bio-available Zinc & Protein",
    },
    lunch: {
      time: "12:30 PM",
      item: "Curd Rice with Pomegranate & Vegetable Paratha",
      detail: "Probiotic homestyle tempered curd rice with pomegranate seeds, served with a stuffed potato-carrot paratha.",
      nutritionTag: "Cooling & Gut Flora Support",
    },
    eveningSnack: {
      time: "4:00 PM",
      item: "Finger Millet (Ragi) Ladoo & Warm Milk",
      detail: "Traditional Karnataka organic ragi flour roasted in pure ghee and sweetened naturally with pure date syrup.",
      nutritionTag: "Rich Calcium & Mineral Density",
    },
  },
  {
    day: "Friday",
    shortDay: "Fri",
    morningSnack: {
      time: "10:15 AM",
      item: "Watermelon Cubes & Mint Water",
      detail: "Hydrating seasonal seedless watermelon cubes with mild lemon-infused spring water.",
      nutritionTag: "Hydration & Electrolytes",
    },
    lunch: {
      time: "12:30 PM",
      item: "Vegetable Biryani with Cucumber Boondi Raita",
      detail: "Mildly spiced fragrant rice with florets of cauliflower, carrots, beans, and paneer cubes.",
      nutritionTag: "Wholesome Micronutrients",
    },
    eveningSnack: {
      time: "4:00 PM",
      item: "Oats & Jaggery Cookies with Fruit Milkshake",
      detail: "Crunchy rolled-oat cookies baked with organic jaggery, accompanied by fresh mango or strawberry milk.",
      nutritionTag: "Hearty Fiber & Mood Elevator",
    },
  },
];

const DIETARY_PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Nut-Free Kitchen",
    desc: "Strict protocol prohibiting peanuts and tree nuts on campus for allergen safety.",
  },
  {
    icon: Apple,
    title: "0% White Refined Sugar",
    desc: "Only unrefined jaggery, whole dates, and natural fruit sweetness are used.",
  },
  {
    icon: Droplets,
    title: "3-Stage UV + RO Alkaline Water",
    desc: "Tested water dispensers accessible at toddler-height throughout the day.",
  },
  {
    icon: Heart,
    title: "Fresh Farm-To-Plate",
    desc: "Organic vegetables sourced daily; no pre-packaged frozen or canned foods.",
  },
];

export default function WeeklyMenu() {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const currentMenu = WEEKLY_MENU[selectedDayIdx];

  return (
    <section id="nutrition" className="relative py-20 bg-gradient-to-b from-[#FFFDF8] via-white to-[#F9FBFF]">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/20 text-[#245412] text-xs font-heading font-semibold mb-3 border border-leaf/30">
            <Utensils size={14} className="text-leaf" />
            <span>Preschool &amp; Daycare Nutrition</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#3a2e4d] tracking-tight">
            Wholesome, Organic <span className="text-candy">Weekly Menu</span> 🥦
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5b4b6b] font-body leading-relaxed">
            Prepared fresh in our certified in-house kitchen every morning. Child-friendly, low sodium, zero artificial colors, and balanced by pediatric nutritionists.
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl gap-1 sm:gap-2 max-w-full overflow-x-auto">
            {WEEKLY_MENU.map((item, idx) => {
              const isActive = selectedDayIdx === idx;
              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-white text-candy shadow-md shadow-black/5 scale-[1.02]"
                      : "text-[#5b4b6b] hover:text-[#3a2e4d] hover:bg-white/60"
                  }`}
                >
                  <span className="hidden sm:inline">{item.day}</span>
                  <span className="sm:hidden">{item.shortDay}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 1. Morning Snack */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-teal-900/5 border border-sky/20 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky/10 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🍎</span>
                <span className="text-xs font-heading font-bold bg-sky/20 text-[#0c5460] px-3 py-1 rounded-full border border-sky/30">
                  {currentMenu.morningSnack.time}
                </span>
              </div>
              <h3 className="text-xs font-heading font-semibold uppercase tracking-wider text-[#5b4b6b]">
                Morning Vitality Snack
              </h3>
              <p className="font-display text-xl font-bold text-[#3a2e4d] mt-1">
                {currentMenu.morningSnack.item}
              </p>
              <p className="text-xs text-[#5b4b6b] font-body mt-2 leading-relaxed">
                {currentMenu.morningSnack.detail}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-black/5 flex items-center gap-1.5 text-[11px] font-heading font-semibold text-sky">
              <Sparkles size={13} />
              <span>{currentMenu.morningSnack.nutritionTag}</span>
            </div>
          </div>

          {/* 2. Hot Lunch */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-900/10 border-2 border-candy/30 flex flex-col justify-between relative overflow-hidden ring-2 ring-candy/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-candy/10 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🍲</span>
                <span className="text-xs font-heading font-bold bg-candy/15 text-candy px-3 py-1 rounded-full border border-candy/25">
                  {currentMenu.lunch.time}
                </span>
              </div>
              <h3 className="text-xs font-heading font-semibold uppercase tracking-wider text-candy">
                Warm Nutritious Lunch
              </h3>
              <p className="font-display text-xl font-bold text-[#3a2e4d] mt-1">
                {currentMenu.lunch.item}
              </p>
              <p className="text-xs text-[#5b4b6b] font-body mt-2 leading-relaxed">
                {currentMenu.lunch.detail}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-black/5 flex items-center gap-1.5 text-[11px] font-heading font-semibold text-candy">
              <Sparkles size={13} />
              <span>{currentMenu.lunch.nutritionTag}</span>
            </div>
          </div>

          {/* 3. Evening Daycare Snack */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-teal-900/5 border border-sunshine/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sunshine/15 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🥛</span>
                <span className="text-xs font-heading font-bold bg-sunshine/20 text-[#694300] px-3 py-1 rounded-full border border-sunshine/40">
                  {currentMenu.eveningSnack.time}
                </span>
              </div>
              <h3 className="text-xs font-heading font-semibold uppercase tracking-wider text-[#5b4b6b]">
                Daycare Energy Snack
              </h3>
              <p className="font-display text-xl font-bold text-[#3a2e4d] mt-1">
                {currentMenu.eveningSnack.item}
              </p>
              <p className="text-xs text-[#5b4b6b] font-body mt-2 leading-relaxed">
                {currentMenu.eveningSnack.detail}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-black/5 flex items-center gap-1.5 text-[11px] font-heading font-semibold text-[#805000]">
              <Sparkles size={13} />
              <span>{currentMenu.eveningSnack.nutritionTag}</span>
            </div>
          </div>
        </div>

        {/* 4 Dietary Safeguards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
          {DIETARY_PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-leaf/15 text-[#245412] flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-[#3a2e4d]">{p.title}</h4>
                  <p className="text-[11px] text-[#5b4b6b] font-body mt-0.5 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Allergy Policy Notice */}
        <div className="mt-6 text-center text-xs text-[#5b4b6b] flex items-center justify-center gap-1.5">
          <Info size={14} className="text-candy" />
          <span>Have specific dairy, gluten, or religious dietary needs? Mention them during admission and our kitchen caters individually.</span>
        </div>
      </div>
    </section>
  );
}
