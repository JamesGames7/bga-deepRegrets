const frontTooltipFish = (coords: [number, number], name, size, depth, type, sell, difficulty) => `
    <div class="fishTooltipGrid">
        <div class="fishTooltipImg" style="background-position: -${coords[0]}00% -${coords[1]}00%"></div>
        <div class="fishTooltipText">
            <div><strong>Name: </strong>${name}</div>
            <div><strong>Size: </strong>${toTitleCase(size)}</div>
            <div><strong>Depth: </strong>${depth}</div>
            <div><strong>Type: </strong>${toTitleCase(type)}</div>
            <div><strong>Sell Value: </strong>${sell}</div>
            <div><strong>Difficulty: </strong>${difficulty}</div>
        </div>
    </div>
`;

function toTitleCase(str: string) {
    return typeof str == "string" ? str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase() : str;
}