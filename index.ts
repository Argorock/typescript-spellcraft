export {};

declare global {
    interface Window {
        setCastingType: (type: string) => void;
        setElement: (type: string) => void;
        toggleBehavior: (behavior: string) => void;
        createSpell: () => void;
        generateButtons: () => void;
    }
}
console.log("index.js loaded");

let selectedCastingType: string = "";
let selectedElement: string = "";
let selectedBehaviors: string[] = [];

interface CastingTypeStats {
    damage: number;
    speed: number;
    range: number;
    cooldown: number;
    manaCost: number;
    castTime: number;

    projectileCount: number;
    spread: number;
    arcHeight: number;

    isContinuous?: boolean;
}
class CastingType {
    name: string;
    description: string;
    stats: CastingTypeStats;

    constructor(name: string, description: string, stats: CastingTypeStats) {
        this.name = name;
        this.description = description;
        this.stats = stats;
    }
}

const CASTING_TYPES: CastingType[] = [
    // ---------------------------------------------------------
    // TIER 1 — Simple, baseline, low modifiers
    // ---------------------------------------------------------

    new CastingType("Single Shot", "One small ball of energy", {
        damage: 1.0,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.0,
        manaCost: 1.0,
        castTime: 1.0,
        projectileCount: 1,
        spread: 0,
        arcHeight: 0
    }),

    new CastingType("Self", "Casts on oneself", {
        damage: 1.0,
        speed: 0,
        range: 0,
        cooldown: 0.7,     // faster reuse
        manaCost: 0.8,     // cheaper
        castTime: 0.5,
        projectileCount: 0,
        spread: 0,
        arcHeight: 0
    }),

    new CastingType("Bolt", "Fast projectile like a bullet", {
        damage: 0.9,       // lighter projectile
        speed: 1.4,        // faster than baseline
        range: 1.2,        // travels farther
        cooldown: 1.0,
        manaCost: 1.0,
        castTime: 1.0,
        projectileCount: 1,
        spread: 0,
        arcHeight: 0
    }),

    new CastingType("Beam", "Instant line that pierces", {
        damage: 0.6,       // low per-tick damage
        speed: 999,        // instant
        range: 1.3,
        cooldown: 1.3,     // beams are taxing
        manaCost: 1.4,
        castTime: 1.0,
        projectileCount: 1,
        spread: 0,
        arcHeight: 0,
        isContinuous: true
    }),

    new CastingType("Snap", "Short‑range instant melee‑like spell", {
        damage: 1.3,       // melee burst
        speed: 999,
        range: 0.4,
        cooldown: 0.7,
        manaCost: 0.7,
        castTime: 0.4,
        projectileCount: 1,
        spread: 0,
        arcHeight: 0
    }),

    new CastingType("Arc", "Projectile affected by gravity", {
        damage: 1.1,       // heavier impact
        speed: 0.85,
        range: 0.8,
        cooldown: 1.0,
        manaCost: 1.0,
        castTime: 1.0,
        projectileCount: 1,
        spread: 0,
        arcHeight: 1.0
    }),

    // ---------------------------------------------------------
    // TIER 2 — Multi‑vector, moderate modifiers
    // ---------------------------------------------------------

    new CastingType("Multi-shot", "Fires three projectiles", {
        damage: 0.75,      // per projectile
        speed: 1.0,
        range: 1.0,
        cooldown: 1.1,
        manaCost: 1.2,
        castTime: 1.0,
        projectileCount: 3,
        spread: 12,
        arcHeight: 0
    }),

    new CastingType("Burst Fire", "Five small projectiles in a row", {
        damage: 0.65,
        speed: 1.1,
        range: 1.0,
        cooldown: 1.2,
        manaCost: 1.3,
        castTime: 1.1,
        projectileCount: 5,
        spread: 6,
        arcHeight: 0
    }),

    new CastingType("Shotgun", "8 projectiles, large spread", {
        damage: 0.55,
        speed: 0.9,
        range: 0.6,
        cooldown: 1.1,
        manaCost: 1.3,
        castTime: 1.0,
        projectileCount: 8,
        spread: 28,
        arcHeight: 0
    }),

    new CastingType("Cone", "Continuous beam cone", {
        damage: 0.45,
        speed: 999,
        range: 0.75,
        cooldown: 1.2,
        manaCost: 1.5,
        castTime: 1.0,
        projectileCount: 1,
        spread: 50,
        arcHeight: 0,
        isContinuous: true
    }),

    new CastingType("Volley", "Arc multishot", {
        damage: 0.85,
        speed: 0.9,
        range: 1.0,
        cooldown: 1.2,
        manaCost: 1.2,
        castTime: 1.0,
        projectileCount: 5,
        spread: 18,
        arcHeight: 1.2
    }),

    new CastingType("Pulse", "360° radial shot", {
        damage: 0.75,
        speed: 1.0,
        range: 0.8,
        cooldown: 1.3,
        manaCost: 1.3,
        castTime: 1.0,
        projectileCount: 12,
        spread: 360,
        arcHeight: 0
    }),

    new CastingType("Wave", "Moving wall", {
        damage: 0.7,
        speed: 0.6,
        range: 1.3,
        cooldown: 1.3,
        manaCost: 1.4,
        castTime: 1.2,
        projectileCount: 1,
        spread: 0,
        arcHeight: 0
    }),

    // ---------------------------------------------------------
    // TIER 3 — Advanced, high modifiers
    // ---------------------------------------------------------

    new CastingType("Gatling Shot", "Continuous rapid fire", {
        damage: 0.35,
        speed: 1.3,
        range: 1.0,
        cooldown: 1.4,
        manaCost: 1.6,
        castTime: 1.0,
        projectileCount: 1,
        spread: 6,
        arcHeight: 0,
        isContinuous: true
    }),

    new CastingType("Rain", "Random falling projectiles", {
        damage: 0.75,
        speed: 0.8,
        range: 1.6,
        cooldown: 1.4,
        manaCost: 1.5,
        castTime: 1.0,
        projectileCount: 20,
        spread: 100,
        arcHeight: 2.2
    }),

    new CastingType("Mark", "Undodgeable targeted strike", {
        damage: 1.3,
        speed: 999,
        range: 1.0,
        cooldown: 1.5,
        manaCost: 1.7,
        castTime: 1.0,
        projectileCount: 1,
        spread: 0,
        arcHeight: 0
    }),

    new CastingType("Cascade", "Traveling area effect", {
        damage: 0.9,
        speed: 0.8,
        range: 1.6,
        cooldown: 1.5,
        manaCost: 1.6,
        castTime: 1.2,
        projectileCount: 10,
        spread: 35,
        arcHeight: 0
    })
];


interface ElementStats {
    damage: number;
    speed: number;
    range: number;
    cooldown: number;
    manaCost: number;
}

class ElementType {
    name: string;
    tier: number;
    description: string;
    stats: ElementStats;

    constructor(name: string, tier: number, description: string, stats: ElementStats) {
        this.name = name;
        this.tier = tier;
        this.description = description;
        this.stats = stats;
    }
}


const ELEMENT_TYPES: ElementType[] = [
    // ---------------------------------------------------------
    // TIER 0.5 — TRUE BASELINE
    // ---------------------------------------------------------
    new ElementType("Arcana", 0.5, "Basic magical energy", {
        damage: 1.0,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.0,
        manaCost: 1.0
    }),

    // ---------------------------------------------------------
    // TIER 1 — BASIC ELEMENTS
    // ---------------------------------------------------------
    new ElementType("Fire", 1, "Element of heat and burning", {
        damage: 1.2,
        speed: 0.9,
        range: 0.9,
        cooldown: 1.1,
        manaCost: 1.2
    }),

    new ElementType("Water", 1, "Element of flow and cleansing", {
        damage: 0.9,
        speed: 1.1,
        range: 1.1,
        cooldown: 1.0,
        manaCost: 0.9
    }),

    new ElementType("Earth", 1, "Element of solidity and force", {
        damage: 1.2,
        speed: 0.8,
        range: 0.9,
        cooldown: 1.1,
        manaCost: 0.9
    }),

    new ElementType("Air", 1, "Element of speed and movement", {
        damage: 0.8,
        speed: 1.3,
        range: 1.2,
        cooldown: 0.9,
        manaCost: 0.9
    }),

    // ---------------------------------------------------------
    // TIER 2 — ENVIRONMENTAL ELEMENTS
    // ---------------------------------------------------------
    new ElementType("Metal", 2, "Earth found in mines", {
        damage: 1.3,
        speed: 0.9,
        range: 1.0,
        cooldown: 1.1,
        manaCost: 1.1
    }),

    new ElementType("Ice", 2, "Water in cold environments", {
        damage: 1.0,
        speed: 0.8,
        range: 1.2,
        cooldown: 1.1,
        manaCost: 1.1
    }),

    new ElementType("Crystal", 2, "Arcana found in mines", {
        damage: 1.1,
        speed: 1.0,
        range: 1.2,
        cooldown: 1.0,
        manaCost: 1.0
    }),

    new ElementType("Mud", 2, "Earth mixed with water", {
        damage: 0.9,
        speed: 0.7,
        range: 0.8,
        cooldown: 1.1,
        manaCost: 0.9
    }),

    new ElementType("Poison", 2, "Water in swamps", {
        damage: 0.9,
        speed: 0.9,
        range: 1.0,
        cooldown: 1.2,
        manaCost: 1.2
    }),

    new ElementType("Steam", 2, "Water in volcanoes", {
        damage: 1.0,
        speed: 1.2,
        range: 1.0,
        cooldown: 1.1,
        manaCost: 1.1
    }),

    new ElementType("Sand", 2, "Earth in deserts", {
        damage: 0.9,
        speed: 0.8,
        range: 0.9,
        cooldown: 1.0,
        manaCost: 0.9
    }),

    new ElementType("Smoke", 2, "Fire in forests", {
        damage: 0.8,
        speed: 1.2,
        range: 0.9,
        cooldown: 1.0,
        manaCost: 1.0
    }),

    new ElementType("Dark", 2, "Arcana in darkness", {
        damage: 1.3,
        speed: 0.9,
        range: 1.0,
        cooldown: 1.2,
        manaCost: 1.2
    }),

    new ElementType("Light", 2, "Arcana in sunshine", {
        damage: 1.1,
        speed: 1.1,
        range: 1.1,
        cooldown: 1.0,
        manaCost: 1.0
    }),

    new ElementType("Lava", 2, "Earth in volcanoes", {
        damage: 1.4,
        speed: 0.7,
        range: 0.8,
        cooldown: 1.3,
        manaCost: 1.3
    }),

    // ---------------------------------------------------------
    // TIER 3 — ADVANCED ELEMENTS
    // ---------------------------------------------------------
    new ElementType("Lightning", 3, "Metal during thunderstorms", {
        damage: 1.4,
        speed: 1.5,
        range: 0.9,
        cooldown: 1.3,
        manaCost: 1.4
    }),

    new ElementType("Void", 3, "Dark in magic", {
        damage: 1.3,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.4,
        manaCost: 1.4
    }),

    new ElementType("Decay", 3, "Dark in swamps or graveyards", {
        damage: 1.1,
        speed: 0.8,
        range: 1.0,
        cooldown: 1.4,
        manaCost: 1.3
    }),

    new ElementType("Life", 3, "Light in forests", {
        damage: 0.9,
        speed: 1.0,
        range: 1.1,
        cooldown: 1.1,
        manaCost: 1.4
    }),

    new ElementType("Starfire", 3, "Light during an eclipse", {
        damage: 1.5,
        speed: 1.1,
        range: 1.0,
        cooldown: 1.3,
        manaCost: 1.4
    }),

    new ElementType("Acid", 3, "Poison in swamps", {
        damage: 1.2,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.3,
        manaCost: 1.3
    }),

    new ElementType("Toxin", 3, "Poison in graveyards", {
        damage: 1.3,
        speed: 0.9,
        range: 1.0,
        cooldown: 1.4,
        manaCost: 1.4
    })
];

interface BehaviorStats {
    damage: number;
    speed: number;
    range: number;
    cooldown: number;
    manaCost: number;

    projectileCount?: number;
    spread?: number;
}

class BehaviorType {
    name: string;
    description: string;
    stats: BehaviorStats;

    constructor(name: string, description: string, stats: BehaviorStats) {
        this.name = name;
        this.description = description;
        this.stats = stats;
    }
}


const BEHAVIOR_TYPES: BehaviorType[] = [
    // ---------------------------------------------------------
    // BASELINE
    // ---------------------------------------------------------
    new BehaviorType("Projectile", "Moves from point A to point B", {
        damage: 1.0,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.0,
        manaCost: 1.0
    }),

    // ---------------------------------------------------------
    // TARGETING / MOVEMENT
    // ---------------------------------------------------------
    new BehaviorType("Homing", "Targets a creature and moves toward it", {
        damage: 0.85,      // homing sacrifices power
        speed: 0.8,
        range: 1.0,
        cooldown: 1.15,
        manaCost: 1.2
    }),

    new BehaviorType("Ricochet", "Bounces off obstacles", {
        damage: 0.9,
        speed: 1.0,
        range: 1.3,        // bounces extend effective range
        cooldown: 1.1,
        manaCost: 1.15
    }),

    new BehaviorType("Phasing", "Passes through solid objects", {
        damage: 0.9,
        speed: 1.0,
        range: 1.1,
        cooldown: 1.05,
        manaCost: 1.1
    }),

    new BehaviorType("Bouncing", "Bounces until it hits", {
        damage: 0.9,
        speed: 1.0,
        range: 1.3,
        cooldown: 1.1,
        manaCost: 1.2
    }),

    new BehaviorType("Shifting", "Randomly changes direction", {
        damage: 0.9,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.1,
        manaCost: 1.1
    }),

    // ---------------------------------------------------------
    // IMPACT / EXPLOSION
    // ---------------------------------------------------------
    new BehaviorType("Burst", "Creates a small pop when the spell dies", {
        damage: 1.1,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.05,
        manaCost: 1.1
    }),

    new BehaviorType("Exploding", "Causes the spell to explode at intervals", {
        damage: 1.3,
        speed: 0.9,
        range: 1.0,
        cooldown: 1.25,
        manaCost: 1.3
    }),

    new BehaviorType("Area of Effect", "Affects all targets in an area", {
        damage: 0.75,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.2,
        manaCost: 1.3
    }),

    new BehaviorType("Zone", "Creates an AOE lingering effect", {
        damage: 0.7,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.3,
        manaCost: 1.4
    }),

    new BehaviorType("Lingering", "Leaves lingering spell particles", {
        damage: 0.8,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.15,
        manaCost: 1.2
    }),

    // ---------------------------------------------------------
    // MULTI‑PROJECTILE / SPLITTING
    // ---------------------------------------------------------
    new BehaviorType("Scatter Shot", "Increases projectile count", {
        damage: 0.7,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.1,
        manaCost: 1.2,
        projectileCount: 3,
        spread: 15
    }),

    new BehaviorType("Double Shot", "Fires two spells", {
        damage: 0.8,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.1,
        manaCost: 1.25,
        projectileCount: 2
    }),

    new BehaviorType("Splintering", "Breaks into multiple projectiles", {
        damage: 0.7,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.2,
        manaCost: 1.3,
        projectileCount: 4
    }),

    new BehaviorType("Orbiting", "Creates 4 orbs that orbit", {
        damage: 0.8,
        speed: 1.0,
        range: 0.8,
        cooldown: 1.2,
        manaCost: 1.3,
        projectileCount: 4
    }),

    new BehaviorType("Spread", "Increases the base spread", {
        damage: 0.9,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.0,
        manaCost: 1.0,
        spread: 10
    }),

    // ---------------------------------------------------------
    // CONTROL / CROWD CONTROL
    // ---------------------------------------------------------
    new BehaviorType("Hexing", "Applies a status effect", {
        damage: 0.7,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.3,
        manaCost: 1.4
    }),

    new BehaviorType("Silencing", "Prevents spellcasting", {
        damage: 0.6,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.4,
        manaCost: 1.5
    }),

    new BehaviorType("Transfix", "Traps the target in place", {
        damage: 0.7,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.3,
        manaCost: 1.4
    }),

    new BehaviorType("Encasing", "Traps the target", {
        damage: 0.7,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.3,
        manaCost: 1.4
    }),

    new BehaviorType("Repelling", "Pushes away", {
        damage: 0.8,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.1,
        manaCost: 1.1
    }),

    new BehaviorType("Tethering", "Links caster and target", {
        damage: 0.8,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.3,
        manaCost: 1.4
    }),

    // ---------------------------------------------------------
    // SPECIAL EFFECTS
    // ---------------------------------------------------------
    new BehaviorType("Chain", "Jumps between nearby enemies", {
        damage: 0.9,
        speed: 1.0,
        range: 1.2,
        cooldown: 1.25,
        manaCost: 1.3
    }),

    new BehaviorType("Piercing", "Increases pierce", {
        damage: 0.9,
        speed: 1.0,
        range: 1.2,
        cooldown: 1.1,
        manaCost: 1.2
    }),

    new BehaviorType("Converging", "Shots converge at point B", {
        damage: 1.0,
        speed: 1.0,
        range: 1.1,
        cooldown: 1.1,
        manaCost: 1.1
    }),

    new BehaviorType("Growth", "Grows in size", {
        damage: 1.2,
        speed: 0.85,
        range: 1.0,
        cooldown: 1.1,
        manaCost: 1.2
    }),

    new BehaviorType("Latching", "Attaches and deals damage over time", {
        damage: 1.3,
        speed: 0.7,
        range: 1.0,
        cooldown: 1.3,
        manaCost: 1.4
    }),

    new BehaviorType("Absorbing", "Pulls inward", {
        damage: 0.9,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.1,
        manaCost: 1.2
    }),

    new BehaviorType("Suspending", "Stops midair", {
        damage: 0.9,
        speed: 0.0,
        range: 0.0,
        cooldown: 1.2,
        manaCost: 1.2
    }),

    new BehaviorType("Life-steal", "Heals the caster", {
        damage: 0.8,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.2,
        manaCost: 1.3
    }),

    new BehaviorType("Anchoring", "Fixes the spell at point B", {
        damage: 1.0,
        speed: 0.0,
        range: 0.0,
        cooldown: 1.1,
        manaCost: 1.1
    }),

    new BehaviorType("Transmutation", "Changes the target", {
        damage: 0.0,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.4,
        manaCost: 1.6
    }),

    new BehaviorType("Mirror-burst", "Casts a mirrored version", {
        damage: 0.8,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.2,
        manaCost: 1.3
    }),

    new BehaviorType("Trigger", "Causes another effect on hit", {
        damage: 0.8,
        speed: 1.0,
        range: 1.0,
        cooldown: 1.3,
        manaCost: 1.4
    })
];


class Spell {
    castingType: CastingType | undefined;
    element: ElementType | undefined;
    behaviors: BehaviorType[];
    finalStats: ElementStats | undefined;

    constructor(castingTypeName: string, elementName: string, behaviorNames: string[]) {
        this.castingType = CASTING_TYPES.find(c => c.name === castingTypeName);
        this.element = ELEMENT_TYPES.find(e => e.name === elementName);
        this.behaviors = BEHAVIOR_TYPES.filter(b => behaviorNames.includes(b.name));

        this.finalStats = this.calculateFinalStats();
    }

    calculateFinalStats(): ElementStats | undefined {
    if (!this.element) return undefined;

    const e = this.element.stats;
    const c = this.castingType?.stats;

        let stats: ElementStats = {
            damage: e.damage * (c?.damage ?? 1),
            speed: e.speed * (c?.speed ?? 1),
            range: e.range * (c?.range ?? 1),
            cooldown: e.cooldown * (c?.cooldown ?? 1),
            manaCost: e.manaCost * (c?.manaCost ?? 1)
        };

        for (const b of this.behaviors) {
            stats.damage *= b.stats.damage;
            stats.speed *= b.stats.speed;
            stats.range *= b.stats.range;
            stats.cooldown *= b.stats.cooldown;
            stats.manaCost *= b.stats.manaCost;
        }

        return stats;
    }

    describe(): string {
        if (!this.finalStats) {
            return "Spell incomplete — missing element.";
        }

        const behaviorList = this.behaviors.length > 0
            ? this.behaviors.map(b => b.name).join(", ")
            : "None";

        return `
        Spell Created!
        ---------------------------
        Casting Type: ${this.castingType?.name ?? "None"}
        Element: ${this.element?.name ?? "None"}
        Behaviors: ${behaviorList}

        --- Final Stats ---
        Damage: ${this.finalStats.damage}
        Speed: ${this.finalStats.speed}
        Range: ${this.finalStats.range}
        Cooldown: ${this.finalStats.cooldown}
        Mana Cost: ${this.finalStats.manaCost}
        `;
    }
}

function createSpell(): void {
    const spell = new Spell(selectedCastingType, selectedElement, selectedBehaviors);

    const output = document.getElementById("output");
    if (output) {
        output.textContent = spell.describe()
    }
}

function setCastingType(type: string): void {
    const error = document.getElementById("error-message");
    if (!error) return;

    error.textContent = "";

    if (selectedCastingType === type) {
        selectedCastingType = "";
        updateSelectedComponents();
        return;
    }
    if (selectedCastingType && selectedCastingType !== type) {
        error.textContent = "You already selected a Casting Type. Remove it first.";
        return;
    }
    selectedCastingType = type;
    updateSelectedComponents();

}

function setElement(type: string): void {
    const error = document.getElementById("error-message");
    if (!error) return;

    error.textContent = "";

    if (selectedElement === type) {
        selectedElement = "";
        updateSelectedComponents();
        return;
    }

    if (selectedElement && selectedElement !== type) {
        error.textContent = "You already selected an Element. Remove it first.";
        return;
    }

    selectedElement = type;
    updateSelectedComponents();

}

function toggleBehavior(behavior: string): void {
    if (selectedBehaviors.includes(behavior)) {
        selectedBehaviors = selectedBehaviors.filter(b => b !== behavior);
    } else {
        selectedBehaviors.push(behavior)
    }
    updateSelectedComponents();
}

function generateButtons() {
    const castContainer = document.getElementById("casting-buttons");
    if (castContainer) {
        CASTING_TYPES.forEach(type => {
            const btn = document.createElement("button");
            btn.setAttribute("data-casting", type.name);
            btn.textContent = type.name;
            btn.onclick = () => setCastingType(type.name);
            castContainer.appendChild(btn);
        });
    }

    const elemContainer = document.getElementById("element-buttons");
    if (elemContainer) {
        ELEMENT_TYPES.forEach(elem => {
            const btn = document.createElement("button");
            btn.setAttribute("data-element", elem.name);
            btn.textContent = elem.name;
            btn.onclick = () => setElement(elem.name);
            elemContainer.appendChild(btn);
        });
    }
    const behContainer = document.getElementById("behavior-buttons");
    if (behContainer) {
        BEHAVIOR_TYPES.forEach(beh => {
            const btn = document.createElement("button");
            btn.setAttribute("data-behavior", beh.name);
            btn.textContent = beh.name;
            btn.onclick = () => toggleBehavior(beh.name);
            behContainer.appendChild(btn);
        });
    }
    updateSelectedComponents();

}

function updateSelectedComponents() {
    const list = document.getElementById("selected-components");
    const error = document.getElementById("error-message");

    if (!list || !error) return;

    list.innerHTML = "";
    error.textContent = "";

    const ct = document.createElement("li");
    ct.textContent = `Casting Type: ${selectedCastingType || "None"}`;
    list.appendChild(ct);

    const el = document.createElement("li");
    el.textContent = `Element: ${selectedElement || "None"}`;
    list.appendChild(el);

    const beh = document.createElement("li");
    beh.textContent = selectedBehaviors.length > 0
        ? `Behaviors: ${selectedBehaviors.join(", ")}`
        : "Behaviors: None";
    list.appendChild(beh);
}



window.setCastingType = setCastingType;
window.setElement = setElement;
window.toggleBehavior = toggleBehavior;
window.createSpell = createSpell;
window.onload = generateButtons;