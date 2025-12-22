<?php

class Fish {
    private $name;
    private $difficulty;
    private $size;
    private $type;
    private $depth;
    private $sellValue;
    private $permanentAbility;
    private $revealAbility;
    private $catchAbility;
    private $eatAbility;
    private $x;
    private $y;
    public function __construct(string $name, int|null $difficulty, string $size, string $type, int $depth, int|null $sellValue, callable|null $permanentAbility, callable|null $revealAbility, callable|null $catchAbility, callable|null $eatAbility, int $x, int $y) {
        $this->name = $name;
        $this->difficulty = $difficulty;
        $this->size = $size;
        $this->type = $type;
        $this->depth = $depth;
        $this->sellValue = $sellValue;
        $this->permanentAbility = $permanentAbility;
        $this->revealAbility = $revealAbility;
        $this->catchAbility = $catchAbility;
        $this->eatAbility = $eatAbility;
        $this->x = $x;
        $this->y = $y;
    }

    public function getName() {
        return $this->name;
    }

    public function getDifficulty() {
        return $this->difficulty;
    }

    public function getSize() {
        return $this->size;
    }

    public function getType() {
        return $this->type;
    }

    public function getDepth() {
        return $this->depth;
    }

    public function getSellValue() {
        return $this->sellValue;
    }

    public function getPermanent() {
        return $this->permanentAbility;
    }
    
    public function getReveal() {
        return $this->revealAbility;
    }

    public function getCatch() {
        return $this->catchAbility;
    }

    public function getEat() {
        return $this->eatAbility;
    }

    public function getCoords() {
        return [$this->x, $this->y];
    }

    public function getData() {
        return ["name" => $this->getName(), "difficulty" => $this->getDifficulty(), "size" => $this->getSize(), "type" => $this->getType(), "depth" => $this->getDepth(), "sell" => $this->getSellValue(), "coords" => $this->getCoords()];
    }

    public function getHidden() {
        return ["size" => $this->getSize(), "depth" => $this->getDepth()];
    }
}