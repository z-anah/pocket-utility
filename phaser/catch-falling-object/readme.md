# 🎮 Wayang Catcher — Phaser Game Project

## Overview

**Wayang Catcher** is a 2D browser game built with **Phaser.js**, designed to demonstrate core game development skills through a culturally inspired concept.

The player controls a character that catches objects falling from the top of the screen. The objective is to catch only items used in a traditional *wayang kulit* performance while avoiding unrelated modern objects.

---

## Concept

This project combines:

* Simple, addictive arcade gameplay
* Clear rule-based interaction
* Cultural storytelling through mechanics

**Core Rule:**

> Catch only objects used in a wayang performance.

---

## Gameplay Mechanics

### Player Actions

* Move left and right
* Catch falling objects

### Scoring System

* ✅ Correct item → +10 points
* ❌ Wrong item → −5 points
* 🔥 Combo system → bonus for consecutive correct catches

### Difficulty Progression

* Increasing fall speed over time
* Increasing spawn rate
* Higher ratio of distracting (wrong) items

---

## Game Objects

### ✔ Correct Items (Wayang Performance)

* Wayang kulit puppets
* Gunungan (kayon)
* Blencong (traditional lamp)
* Kendang (drum)
* Gamelan instruments
* Dalang tools (cempala, puppet box)

### ✖ Wrong Items

* Smartphones
* LED lamps
* Modern electronics
* Non-related objects

---

## Technical Implementation

### Tech Stack

* **Framework:** Phaser.js (v3)
* **Language:** JavaScript / TypeScript (optional)
* **Rendering:** Canvas/WebGL

### Core Features Implemented

* Scene lifecycle (`preload`, `create`, `update`)
* Physics system (arcade physics)
* Collision detection (`overlap`)
* Object spawning system
* Score & UI handling

### Architecture Highlights

* Modular scene structure
* Reusable object groups (pooling-ready)
* Scalable spawn logic (probability-based)

---

## Visual Direction

* **Art Style:** Retro flat illustration
* **Aesthetic:** 90s indie nostalgia
* **Palette:** Vibrant limited pastel
* **Line Work:** Bold, clean ink
* **Shading:** Cel-shaded
* **Texture:** Subtle risograph grain

---

## What This Project Demonstrates

### Game Development Skills

* Real-time interaction handling
* Game loop design
* Physics-based mechanics
* Difficulty balancing

### Engineering Practices

* Clean, readable code structure
* Separation of concerns
* Expandable system design

### Product Thinking

* Clear gameplay loop
* User feedback systems (score, combo, effects)
* Thematic consistency

---

## Potential Extensions

* Sound design (gamelan-based audio feedback)
* Mobile responsiveness (touch controls)
* Leaderboard integration
* Educational mode (object naming)
* Asset animation (sprite sheets)

---

## Why This Project

This project is intentionally scoped to:

* Be simple enough to complete quickly
* Demonstrate strong fundamentals
* Remain extensible for future features

It reflects the ability to:

* Translate ideas into playable systems
* Balance gameplay and technical constraints
* Build structured, maintainable front-end applications

---

## Contact

Available for:

* Frontend development (Vue, JS/TS)
* Phaser / HTML5 game development
* Freelance & remote projects

Please reach out via:

* Upwork
* LinkedIn

---


<!-- 1. The Young Dalang-in-Training
This is a kid-version of a Dalang (puppet master).

Appearance: A young boy wearing a Blangkon (traditional Javanese headgear) and a simple Beskap (jacket) or a batik shirt, but paired with modern sneakers to keep the "new meets old" style.

The Catching Tool: Instead of a simple basket, he could hold a Kotak Wayang (the wooden chest used to store puppets). -->


---

# PROMPT

For test purposes inside catch-falling-object/
Create a hello world using Phaser using https://www.dafont.com/ari-w9500.font
test/index.html: an example Phaser project, get inspired of it