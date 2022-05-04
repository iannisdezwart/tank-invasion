GFX.init()
MapBounds.init(3, 3)

new Player()

const render = () =>
{
	GFX.clear()
	MapBounds.render()
	Tank.renderAll()
	ScoreBlock.renderAll()
	Bullet.renderAll()
	requestAnimationFrame(render)
}

Tank.spawnEnemy()

setInterval(() => {
	Tank.spawnEnemy()
}, 10000)

setInterval(() => {
	ScoreBlock.spawn()
}, 1000)

requestAnimationFrame(render)