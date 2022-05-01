class MapBounds
{
	static width: number
	static height: number

	static PADDING = 1

	static init(width: number, height: number)
	{
		MapBounds.width = width
		MapBounds.height = height
	}

	static isInBigBounds(x: number, y: number)
	{
		return x >= -MapBounds.PADDING
			&& x < MapBounds.width + MapBounds.PADDING
			&& y >= -MapBounds.PADDING
			&& y < MapBounds.height + MapBounds.PADDING
	}

	static render()
	{
		// Render the map grid.

		for (let x = 0.1; x < MapBounds.width; x += 0.1)
		{
			GFX.strokeLine({
				xFrom: x,
				yFrom: 0,
				xTo: x,
				yTo: MapBounds.height,
				colour: '#ccc',
				lineWidth: 0.0025
			})
		}

		for (let y = 0.1; y < MapBounds.height; y += 0.1)
		{
			GFX.strokeLine({
				xFrom: 0,
				yFrom: y,
				xTo: MapBounds.width,
				yTo: y,
				colour: '#ccc',
				lineWidth: 0.0025
			})
		}

		// Render the map bounds.

		GFX.strokeRect({
			x: 0,
			y: 0,
			width: MapBounds.width,
			height: MapBounds.height,
			colour: '#444',
			lineWidth: 0.025
		})
	}
}