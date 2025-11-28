<?php 

require_once("Fish.php");
class Lists {
    public array $fish;
    public Item $items;

    public function __construct()
    {
        $this->fish = [
            new Fish("Barracuda", 3, "middling", "fair", 1, 4, null, null, null, function () {}, 0, 0),
            new Fish("Black Scabbardfish", 2, "middling", "fair", 1, 3, null, null, null, function () {}, 1, 0),
            new Fish("Black Seabass", 1, "middling", "fair", 1, 2, null, null, null, function () {}, 2, 0),
            new Fish("Day Octopus", 2, "middling", "fair", 1, 3, function () {}, null, null, function () {}, 3, 0),
            new Fish("Eyefish", 1, "small", "foul", 1, 0, null, null, function () {}, function () {}, 4, 0),
            new Fish("Man O' War", null, "small", "fair", 1, 1, null, function () {}, null, null, 5, 0),
            new Fish("Payara", 2, "middling", "fair", 1, 3, null, null, null, function () {}, 6, 0),
            new Fish("Triggerfish", 1, "small", "fair", 1, 1, null, null, null, function () {}, 7, 0),
            new Fish("Bluefin Tuna", 3, "large", "fair", 2, 5, null, null, function () {}, function () {}, 8, 0),
            new Fish("Grief Lurker", null, "large", "foul", 2, 3, null, function () {}, null, null, 9, 0),
            new Fish("Stye Eel", 3, "small", "foul", 2, 3, function () {}, null, function () {}, function () {}, 10, 0),
            new Fish("Abyssal Star", 3, "middling", "foul", 3, 6, null, null, function () {}, null, 11, 0),
            new Fish("Kelpie", 6, "large", "foul", 3, 8, null, function () {}, null, null, 12, 0),
            new Fish("Cax", 3, "large", "foul", 1, 3, null, function () {}, null, function () {}, 0, 1),
            new Fish("Coelacanth", 2, "large", "fair", 1, 4, null, null, null, function () {}, 1, 1),
            new Fish("Corpse", 2, "large", "foul", 1, 1, null, function () {}, null, function () {}, 2, 1),
            new Fish("Cutthroat Trout", 1, "small", "fair", 1, 1, null, null, null, function () {}, 3, 1),
            new Fish("Flounder", 2, "small", "fair", 1, 2, null, null, null, function () {}, 4, 1),
            new Fish("Mahi-Mahi", 1, "middling", "fair", 1, 2, null, null, null, function () {}, 5, 1),
            new Fish("Ghoul Ray", 2, "middling", "foul", 1, 2, null, null, function () {}, function () {}, 6, 1),
            new Fish("Tumorous Fish", 2, "middling", "foul", 1, 2, null, null, function () {}, function () {}, 7, 1),
            new Fish("Bowel Angel", 4, "middling", "foul", 2, 5, null, function () {}, null, function () {}, 8, 1),
            new Fish("Green Moray", 2, "middling", "fair", 2, 3, function () {}, null, null, function () {}, 9, 1),
            new Fish("Sub Matriarch", 2, "large", "foul", 2, 6, function () {}, null, null, null, 10, 1),
            new Fish("Anglerfish", 3, "small", "fair", 3, 4, null, null, function () {}, function () {}, 11, 1),
            new Fish("Kraken", 7, "large", "foul", 3, 9, function () {}, function () {}, null, null, 12, 1),
            new Fish("Foot", 0, "small", "foul", 1, 0, null, function () {}, null, function () {}, 0, 2),
            new Fish("Flying Gurnard", 1, "small", "fair", 1, 1, null, null, null, function () {}, 1, 2),
            new Fish("Geist", 0, "small", "foul", 1, 0, null, null, function () {}, function () {}, 2, 2),
            new Fish("Filefish", 1, "small", "fair", 1, 1, null, null, null, function () {}, 3, 2),
            new Fish("Halley's Folly", 4, "large", "foul", 1, 4, null, function () {}, null, function () {}, 4, 2),
            new Fish("Manta Ray", 3, "large", "fair", 1, 4, null, function () {}, null, null, 5, 2),
            new Fish("Osteofish", 0, "small", "foul", 1, 0, null, null, function () {}, null, 6, 2),
            new Fish("Amulet of Agartha", 3, "small", "foul", 2, null, function () {}, null, function () {}, null, 7, 2),
            // FIXME - size
            new Fish("Humpback Whale", null, "large", "fair", 2, null, function () {}, function () {}, null, null, 8, 2),
            new Fish("Iron Coffin", 0, "middling", "foul", 2, null, function () {}, null, function () {}, null, 9, 2),
            new Fish("The Mollusk", 3, "middling", "foul", 2, 4, null, function () {}, null, function () {}, 10, 2),
            new Fish("Benthic Slug", 2, "small", "foul", 3, 4, null, null, function () {}, function () {}, 11, 2),
            new Fish("Lanternfish", 3, "small", "fair", 3, 4, null, function () {}, null, function () {}, 12, 2),
            new Fish("Hammerhead Shark", 3, "large", "fair", 1, 5, null, null, function () {}, function () {}, 0, 3),
            new Fish("Misery Stalker", null, "large", "foul", 1, 2, null, null, function () {}, null, 1, 3),
            new Fish("Parasitic Larvae", null, "large", "foul", 1, 1, null, function () {}, null, null, 2, 3),
            new Fish("Pram", 1, "middling", "foul", 1, 0, null, function () {}, null, null, 3, 3),
            new Fish("Fugu", 3, "small", "fair", 1, 3, null, function () {}, null, function () {}, 4, 3),
            new Fish("Scrat", 3, "middling", "foul", 1, 3, null, function () {}, null, function () {}, 5, 3),
            new Fish("Goliath Grouper", 2, "large", "fair", 1, 4, null, null, null, function () {}, 6, 3),
            new Fish("Whiptail Stingray", 3, "middling", "fair", 1, 4, null, function () {}, null, function () {}, 7, 3),
            new Fish("Box Jellyfish", 2, "small", "fair", 2, 3, null, function () {}, null, null, 8, 3),
            new Fish("Lamprey", 1, "small", "fair", 2, 2, function () {}, null, null, function () {}, 9, 3),
            new Fish("Whispering Skull", 2, "small", "foul", 2, null, function () {}, null, function () {}, null, 10, 3),
            new Fish("Deepworm", 3, "small", "foul", 3, 5, null, null, function () {}, function () {}, 11, 3),
            new Fish("Magnapinna Squid", 6, "large", "fair", 3, 7, null, null, null, null, 12, 3),
            new Fish("Sheepshead", 1, "middling", "fair", 1, 2, null, null, null, function () {}, 0, 4),
            new Fish("Lionfish", 1, "small", "fair", 1, 1, null, null, function () {}, function () {}, 1, 4),
            new Fish("Sockeye Salmon", 1, "small", "fair", 1, 1, null, null, null, function () {}, 2, 4),
            new Fish("Swordfish", 4, "large", "fair", 1, 5, null, null, function () {}, function () {}, 3, 4),
            new Fish("Striped Marlin", 4, "large", "fair", 1, 5, null, function () {}, null, function () {}, 4, 4),
            new Fish("Sunfish", 2, "large", "fair", 1, 4, null, function () {}, null, null, 5, 4),
            new Fish("Tiger Shark", 3, "large", "fair", 1, 5, null, null, function () {}, function () {}, 6, 4),
            new Fish("Bathyphysa Conifera", null, "small", "fair", 2, 2, null, function () {}, null, null, 7, 4),
            new Fish("Bubo", 3, "middling", "foul", 2, 3, null, function () {}, null, function () {}, 8, 4),
            new Fish("Mermaid", 4, "middling", "foul", 2, 4, null, null, function () {}, function () {}, 9, 4),
            new Fish("Stoor Worm", 5, "large", "foul", 2, 7, null, null, function () {}, null, 10, 4),
            new Fish("Barreleye", 2, "small", "fair", 3, 3, null, function () {}, null, function () {}, 11, 4),
            new Fish("Mass of Eyes", 4, "large", "foul", 3, 7, null, function () {}, null, function () {}, 12, 4),
            new Fish("Cruachan Spawn", 4, "large", "foul", 2, 5, null, null, function () {}, null, 0, 5),
            // FIXME - size
            new Fish("Deep Dweller", null, "large", "foul", 2, null, null, function () {}, null, null, 1, 5),
            new Fish("Colossal Squid", null, "large", "fair", 2, 3, function () {}, function () {}, null, null, 2, 5),
            new Fish("Dunkleosteus", 5, "large", "foul", 2, 6, null, null, function () {}, null, 3, 5),
            new Fish("Fried Egg Jellyfish", 1, "small", "fair", 2, 2, null, function () {}, null, null, 4, 5),
            new Fish("Frilled Shark", 2, "middling", "fair", 2, 4, null, null, function () {}, function () {}, 5, 5),
            new Fish("Giant Octopus", 4, "large", "fair", 2, 6, function () {}, null, null, function () {}, 6, 5),
            // FIXME - size
            new Fish("Tidal Trafficker", null, "large", "foul", 1, null, null, function () {}, null, null, 7, 5),
            new Fish("Great White Shark", 4, "large", "fair", 2, 6, null, function () {}, null, null, 8, 5),
            new Fish("Midas Devil", 3, "small", "foul", 2, 3, null, null, function () {}, null, 9, 5),
            new Fish("Orca", 3, "large", "fair", 2, 0, function () {}, null, function () {}, null, 10, 5),
            new Fish("Bathyal Queen", 5, "middling", "foul", 3, 7, null, null, function () {}, null, 11, 5),
            new Fish("Mermer", 5, "small", "foul", 3, 6, null, function () {}, null, function () {}, 12, 5),
            new Fish("Monkfish", 3, "middling", "fair", 2, 4, null, null, null, function () {}, 0, 6),
            new Fish("Porcupine Fish", 4, "small", "fair", 2, 4, null, function () {}, null, function () {}, 1, 6),
            new Fish("Northern Stargazer", 2, "small", "fair", 2, 3, null, function () {}, null, null, 2, 6),
            new Fish("Remora", 1, "small", "fair", 2, 2, function () {}, null, null, function () {}, 3, 6),
            new Fish("Sarcastic Fringehead", 2, "small", "fair", 2, 3, null, null, null, function () {}, 4, 6),
            new Fish("Sea Monkey", 4, "middling", "foul", 2, 5, null, null, function () {}, null, 5, 6),
            new Fish("Selkie", 5, "large", "foul", 2, 6, null, null, function () {}, null, 6, 6),
            new Fish("Rotfish", 2, "small", "foul", 2, 3, null, null, function () {}, function () {}, 7, 6),
            new Fish("Siren", 3, "middling", "foul", 2, 5, null, function () {}, null, null, 8, 6),
            new Fish("Spider Crab", 3, "middling", "fair", 2, 4, null, null, null, function () {}, 9, 6),
            new Fish("Abyssal Colony", null, "small", "foul", 3, 3, null, function () {}, null, null, 10, 6),
            new Fish("Rocabarraigh Queen", 6, "large", "foul", 3, 8, null, null, function () {}, null, 11, 6),
            new Fish("No Face", 3, "middling", "foul", 3, 5, function () {}, null, function () {}, null, 12, 6),
            new Fish("Brittle Lung", 5, "large", "foul", 2, 7, null, function () {}, null, null, 0, 7),
            new Fish("Aphotic Asp", 3, "small", "foul", 3, 5, null, null, function () {}, function () {}, 1, 7),
            new Fish("Eversquid", 4, "middling", "foul", 3, 2, null, null, function () {}, null, 2, 7),
            new Fish("Halibut", 2, "middling", "fair", 2, 3, null, null, null, function () {}, 3, 7),
            new Fish("Giant Isopod", 6, "large", "fair", 3, 6, function () {}, null, null, null, 4, 7),
            new Fish("Gloom Orphan", null, "large", "foul", 3, 5, null, function () {}, null, null, 5, 7),
            new Fish("Goblin Shark", 4, "middling", "fair", 3, 6, null, null, function () {}, null, 6, 7),
            new Fish("Bride of the Sea", 4, "middling", "foul", 3, 6, null, null, function () {}, null, 7, 7),
            new Fish("Gulper Eel", 4, "middling", "fair", 3, 6, function () {}, null, null, null, 8, 7),
            new Fish("Hagfish", 3, "small", "fair", 3, 3, function () {}, null, null, function () {}, 9, 7),
            new Fish("Human", 4, "middling", "foul", 3, 6, null, function () {}, null, function () {}, 10, 7),
            new Fish("Hollow Earth Infant", 8, "large", "foul", 3, 9, null, function () {}, function () {}, null, 11, 7),
            new Fish("Oarfish", 5, "middling", "fair", 3, 6, null, function () {}, null, null, 12, 7),
            new Fish("Phantom Jellyfish", 4, "large", "fair", 3, 6, null, function () {}, null, null, 0, 8),
            // FIXME - size
            new Fish("Profound Peddler", null, "large", "foul", 3, null, null, function () {}, null, null, 1, 8),
            new Fish("Sea Bishop", 4, "middling", "foul", 3, 6, null, null, function () {}, null, 2, 8),
            new Fish("Slitmouth", 4, "small", "foul", 3, 5, null, null, function () {}, function () {}, 3, 8),
            new Fish("Skitterfin", 4, "small", "foul", 3, 5, null, function () {}, null, function () {}, 4, 8),
            // FIXME - size
            new Fish("The Plug", null, "large", "foul", 3, null, function () {}, null, null, null, 5, 8),
            new Fish("Pustor", 3, "small", "foul", 3, 5, null, null, function () {}, null, 6, 8),
            new Fish("Trauma Leech", null, "large", "foul", 3, 4, null, function () {}, null, null, 7, 8),
            new Fish("Treasure Chest", 5, "large", "fair", 3, null, null, null, function () {}, null, 8, 8),
            new Fish("Two Face", 3, "middling", "foul", 3, 5, function () {}, null, function () {}, null, 9, 8),
            new Fish("Varicolla", 4, "small", "foul", 3, 5, null, null, function () {}, function () {}, 10, 8),
            // FIXME - size
            new Fish("Whale of Rocabarraigh", null, "large", "foul", 3, null, null, function () {}, null, null, 11, 8),
            new Fish("Writhing Mass", 5, "middling", "foul", 3, 7, null, function () {}, null, null, 12, 8)
        ];
    }

    public function getFish() {
        return $this->fish;
    }

    public function getItems() {
        return $this->items;
    }
}