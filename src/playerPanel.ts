const tmpl_playerBoard = (id, colour, firstPlayer) => `
    ${firstPlayer == id ? `<div id="firstPlayerPanel"></div>` : ""}
`;