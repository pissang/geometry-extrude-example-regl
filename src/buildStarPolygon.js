export default function buildStarPolygon(n) {

    const starPolygon = [];

    function addStar(r) {
        const cx = 0;
        const cy = 0;
        const r0 = r / 2;
        const dStep = Math.PI / n;
        let deg = -Math.PI / 2;
        const xStart = cx + r * Math.cos(deg);
        const yStart = cy + r * Math.sin(deg);
        deg += dStep;
        const points = [[xStart, yStart]];

        for (let i = 0, end = n * 2 - 1, ri; i < end; i++) {
            ri = i % 2 === 0 ? r0 : r;
            points.push([cx + ri * Math.cos(deg), cy + ri * Math.sin(deg)]);
            deg += dStep;
        }

        starPolygon.push(points);
    }

    addStar(10);
    addStar(4);

    return starPolygon;
}