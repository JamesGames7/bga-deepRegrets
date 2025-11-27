define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    getLibUrl('bga-animations', '1.x'),
    getLibUrl('bga-cards', '1.x')
],
function (dojo, declare, gamegui, counter, BgaAnimations, BgaCards) {
    (window as any).BgaAnimations = BgaAnimations;
    (window as any).BgaCards = BgaCards;
    return declare("bgagame.deepregrets", ebg.core.gamegui, new DeepRegrets());             
});