const tmpl_playerBoard = (id, colour, firstPlayer, lifePreserver) => `
    ${firstPlayer == id ? `<div id="firstPlayerPanel"></div>` : ""}
    ${lifePreserver == id ? `<div id="lifePreserverPanel"></div>` : ""}
`;