enum ScoreBlockType { TRIANGLE, RECTANGLE, PENTAGON, __END__ }

const scoreBlockColour = (type: ScoreBlockType) =>
{
	switch (type)
	{
	case ScoreBlockType.TRIANGLE:
		return '#de6254'

	case ScoreBlockType.RECTANGLE:
		return '#deb33c'

	case ScoreBlockType.PENTAGON:
		return '#327cc2'
	}
}

const scoreBlockOutlineColour = (type: ScoreBlockType) =>
{
	switch (type)
	{
	case ScoreBlockType.TRIANGLE:
		return '#b5463a'

	case ScoreBlockType.RECTANGLE:
		return '#9e7f28'

	case ScoreBlockType.PENTAGON:
		return '#205485'
	}
}

const scoreBlockRadius = (type: ScoreBlockType) =>
{
	switch (type)
	{
	case ScoreBlockType.TRIANGLE:
		return 0.05

	case ScoreBlockType.RECTANGLE:
		return 0.07

	case ScoreBlockType.PENTAGON:
		return 0.10
	}
}

const scoreBlockHealth = (type: ScoreBlockType) =>
{
	switch (type)
	{
	case ScoreBlockType.TRIANGLE:
		return 20

	case ScoreBlockType.RECTANGLE:
		return 40

	case ScoreBlockType.PENTAGON:
		return 80
	}
}

const scoreBlockScore = (type: ScoreBlockType) =>
{
	switch (type)
	{
	case ScoreBlockType.TRIANGLE:
		return 10

	case ScoreBlockType.RECTANGLE:
		return 25

	case ScoreBlockType.PENTAGON:
		return 75
	}
}

class ScoreBlock
{
	x: number
	y: number
	colour: string
	outlineColour: string
	radius: number
	health: number
	maxHealth: number
	type: ScoreBlockType
	angle: number

	static scoreBlocks: ScoreBlock[] = []

	constructor(x: number, y: number, type: ScoreBlockType)
	{
		this.x = x
		this.y = y
		this.colour = scoreBlockColour(type)
		this.outlineColour = scoreBlockOutlineColour(type)
		this.radius = scoreBlockRadius(type)
		this.maxHealth = scoreBlockHealth(type)
		this.health = this.maxHealth
		this.type = type
		this.angle = Math.random() * Math.PI * 2

		ScoreBlock.scoreBlocks.push(this)
	}

	move()
	{
		this.angle += 0.001
	}

	static renderAll()
	{
		for (const scoreBlock of ScoreBlock.scoreBlocks)
		{
			scoreBlock.render()
		}
	}

	render()
	{
		this.move()

		let sides: number

		switch (this.type)
		{
		case ScoreBlockType.TRIANGLE:
			sides = 3
			break

		case ScoreBlockType.RECTANGLE:
			sides = 4
			break

		case ScoreBlockType.PENTAGON:
			sides = 5
			break
		}

		// Body.

		GFX.fillPolygon(sides, {
			x: this.x,
			y: this.y,
			radius: this.radius,
			colour: this.colour,
			angle: this.angle
		})

		// Outline.

		GFX.strokePolygon(sides, {
			x: this.x,
			y: this.y,
			radius: this.radius,
			colour: this.outlineColour,
			lineWidth: 0.01,
			angle: this.angle
		})

		// Health bar fill.

		let healthBarFillColour: string

		if (this.health > this.maxHealth * 0.67)
		{
			healthBarFillColour = '#2f0'
		}
		else if (this.health > this.maxHealth * 0.33)
		{
			healthBarFillColour = '#f70'
		}
		else
		{
			healthBarFillColour = '#f00'
		}

		GFX.fillRect({
			x: this.x - HEALTH_BAR_WIDTH / 2,
			y: this.y + this.radius + HEALTH_BAR_HEIGHT * 2,
			width: HEALTH_BAR_WIDTH * this.health / this.maxHealth,
			height: HEALTH_BAR_HEIGHT,
			colour: healthBarFillColour
		})

		// Health bar outline.

		GFX.strokeRect({
			x: this.x - HEALTH_BAR_WIDTH / 2,
			y: this.y + this.radius + HEALTH_BAR_HEIGHT * 2,
			width: HEALTH_BAR_WIDTH,
			height: HEALTH_BAR_HEIGHT,
			colour: '#333',
			lineWidth: 0.01
		})
	}

	touches(x: number, y: number)
	{
		return Math.hypot(this.x - x, this.y - y) < this.radius
	}

	pop(player: Player)
	{
		// Award the player points.

		player.score += scoreBlockScore(this.type)

		// Remove this score block from the list of score blocks.

		const i = ScoreBlock.scoreBlocks.indexOf(this)
		ScoreBlock.scoreBlocks[i]
			= ScoreBlock.scoreBlocks[ScoreBlock.scoreBlocks.length - 1]
		ScoreBlock.scoreBlocks.pop()
	}

	hit(bullet: Bullet)
	{
		// Only get hit by players, not by enemies.

		if (!(bullet.owner instanceof Player))
		{
			return
		}

		// Reduce the score block's health.

		this.health -= bullet.damage

		// If the score block is dead, pop it.

		if (this.health <= 0)
		{
			this.pop(bullet.owner)
		}
	}

	static spawn()
	{
		const type = Math.floor(Math.random() * ScoreBlockType.__END__)
		const x = Math.random() * MapBounds.width
		const y = Math.random() * MapBounds.height

		new ScoreBlock(x, y, type)
	}
}