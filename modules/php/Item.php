<?php

class Item {
    private $name;
    private $effect;
    private $x;
    private $y;
    public function __construct($name, $effect, $x, $y) {
        $this->name = $name;
        $this->effect = $effect;
        $this->x = $x;
        $this->y = $y;
    }

    public function getName() {
        return $this->name;
    }

    public function getEffect() {
        return $this->effect;
    }

    public function getCoords() {
        return [$this->x, $this->y];
    }

    // FIXME add "text" for tooltip
}