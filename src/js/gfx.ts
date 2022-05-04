interface StrokeLineOptions
{
	xFrom: number
	yFrom: number
	xTo: number
	yTo: number
	colour: string
	lineWidth: number
}

interface FillCirleOptions
{
	x: number
	y: number
	radius: number
	colour: string
}

interface StrokeCircleOptions
{
	x: number
	y: number
	radius: number
	colour: string
	lineWidth: number
}

interface FillRectOptions
{
	x: number
	y: number
	width: number
	height: number
	colour: string
	angle?: number
	xBase?: number
	yBase?: number
}

interface StrokeRectOptions
{
	x: number
	y: number
	width: number
	height: number
	colour: string
	lineWidth: number
	angle?: number
	xBase?: number
	yBase?: number
}

interface FillPolygonOptions
{
	x: number
	y: number
	radius: number
	colour: string
	angle?: number
	xBase?: number
	yBase?: number
}

interface StrokePolygonOptions
{
	x: number
	y: number
	radius: number
	colour: string
	lineWidth: number
	angle?: number
	xBase?: number
	yBase?: number
}

class GFX
{
	static canvas: HTMLCanvasElement
	static ctx: CanvasRenderingContext2D

	static init()
	{
		GFX.canvas = document.querySelector('canvas')
		GFX.ctx = GFX.canvas.getContext('2d')

		addEventListener('resize', GFX.handleResize)
		GFX.handleResize()
	}

	private static handleResize()
	{
		GFX.canvas.width = innerWidth * devicePixelRatio
		GFX.canvas.height = innerHeight * devicePixelRatio
	}

	/**
	 * Maps an x-coordinate to the canvas pixel space.
	 */
	private static trX(x: number)
	{
		x -= Player.instance.x
		return x * GFX.canvas.height / 2 + 0.5 * GFX.canvas.width
	}

	/**
	 * Maps a y-coordinate to the canvas pixel space.
	 */
	private static trY(y: number)
	{
		y -= Player.instance.y
		return y * GFX.canvas.height / 2 + 0.5 * GFX.canvas.height
	}

	/**
	 * Scales a length unit to the canvas pixel space.
	 */
	private static trL(l: number)
	{
		return l * GFX.canvas.height / 2
	}

	static clear()
	{
		GFX.ctx.clearRect(0, 0, GFX.canvas.width, GFX.canvas.height)
	}

	static strokeLine(options: StrokeLineOptions)
	{
		const { xFrom, yFrom, xTo, yTo, colour, lineWidth } = options

		GFX.ctx.beginPath()
		GFX.ctx.moveTo(GFX.trX(xFrom), GFX.trY(yFrom))
		GFX.ctx.lineTo(GFX.trX(xTo), GFX.trY(yTo))
		GFX.ctx.strokeStyle = colour
		GFX.ctx.lineWidth = GFX.trL(lineWidth)
		GFX.ctx.stroke()
	}

	static fillCircle(options: FillCirleOptions)
	{
		const { x, y, radius, colour } = options

		GFX.ctx.beginPath()
		GFX.ctx.arc(GFX.trX(x), GFX.trY(y), GFX.trL(radius),
			0, Math.PI * 2)
		GFX.ctx.fillStyle = colour
		GFX.ctx.fill()
	}

	static strokeCircle(options: StrokeCircleOptions)
	{
		const { x, y, radius, colour, lineWidth } = options

		GFX.ctx.beginPath()
		GFX.ctx.arc(GFX.trX(x), GFX.trY(y), GFX.trL(radius),
			0, Math.PI * 2)
		GFX.ctx.strokeStyle = colour
		GFX.ctx.lineWidth = GFX.trL(lineWidth)
		GFX.ctx.stroke()
	}

	static fillRect(options: FillRectOptions)
	{
		const { x, y, width, height, colour, angle, xBase, yBase } = {
			...{ angle: 0, xBase: 0, yBase: 0 },
			...options
		}

		GFX.ctx.save()
		GFX.ctx.translate(GFX.trX(x), GFX.trY(y))
		GFX.ctx.rotate(angle)
		GFX.ctx.fillStyle = colour
		GFX.ctx.fillRect(GFX.trL(xBase), GFX.trL(yBase),
			GFX.trL(width), GFX.trL(height))
		GFX.ctx.restore()
	}

	static strokeRect(options: StrokeRectOptions)
	{
		const { x, y, width, height, colour, xBase, yBase, angle, lineWidth } = {
			...{ angle: 0, xBase: 0, yBase: 0 },
			...options
		}

		GFX.ctx.save()
		GFX.ctx.translate(GFX.trX(x), GFX.trY(y))
		GFX.ctx.rotate(angle)
		GFX.ctx.strokeStyle = colour
		GFX.ctx.lineWidth = GFX.trL(lineWidth)
		GFX.ctx.strokeRect(GFX.trL(xBase), GFX.trL(yBase),
			GFX.trL(width), GFX.trL(height))
		GFX.ctx.restore()
	}

	static fillPolygon(size: number, options: FillPolygonOptions)
	{
		const { x, y, radius, colour, angle, xBase, yBase } = {
			...{ angle: 0, xBase: 0, yBase: 0 },
			...options
		}

		GFX.ctx.save()
		GFX.ctx.translate(GFX.trX(x), GFX.trY(y))
		GFX.ctx.rotate(angle - Math.PI / 2)
		GFX.ctx.fillStyle = colour

		const angleStep = 2 * Math.PI / size

		GFX.ctx.beginPath()
		GFX.ctx.moveTo(GFX.trL(xBase + radius), GFX.trL(yBase))

		for (let i = 0; i < size; i++)
		{
			GFX.ctx.lineTo(
				GFX.trL(xBase + radius * Math.cos(i * angleStep)),
				GFX.trL(yBase + radius * Math.sin(i * angleStep)))
		}

		GFX.ctx.closePath()
		GFX.ctx.fill()
		GFX.ctx.restore()
	}

	static strokePolygon(size: number, options: StrokePolygonOptions)
	{
		const { x, y, radius, colour, angle, xBase, yBase, lineWidth } = {
			...{ angle: 0, xBase: 0, yBase: 0 },
			...options
		}

		GFX.ctx.save()
		GFX.ctx.translate(GFX.trX(x), GFX.trY(y))
		GFX.ctx.rotate(angle - Math.PI / 2)
		GFX.ctx.strokeStyle = colour
		GFX.ctx.lineWidth = GFX.trL(lineWidth)

		const angleStep = 2 * Math.PI / size

		GFX.ctx.beginPath()
		GFX.ctx.moveTo(GFX.trL(xBase + radius), GFX.trL(yBase))

		for (let i = 0; i < size; i++)
		{
			GFX.ctx.lineTo(
				GFX.trL(xBase + radius * Math.cos(i * angleStep)),
				GFX.trL(yBase + radius * Math.sin(i * angleStep)))
		}

		GFX.ctx.closePath()
		GFX.ctx.stroke()
		GFX.ctx.restore()
	}

	static fillTriangle(options: FillPolygonOptions)
	{
		GFX.fillPolygon(3, options)
	}

	static strokeTriangle(options: StrokePolygonOptions)
	{
		GFX.strokePolygon(3, options)
	}

	static fillPentagon(options: FillPolygonOptions)
	{
		GFX.fillPolygon(5, options)
	}

	static strokePentagon(options: StrokePolygonOptions)
	{
		GFX.strokePolygon(5, options)
	}
}