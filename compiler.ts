import { compilePages, inlineJS, inlineSASS, PageShell } from 'page-compiler'

const main = async () =>
{
	const pageShell = new PageShell({
		head: /* html */ `
		${ await inlineSASS('src/sass/index.sass') }
		`
	})

	compilePages([
		{
			html: pageShell.render('TankInvasion', /* html */ `
			<canvas></canvas>
			<div id="bottom-hud">
				<div id="score">
					<span id="score-value">Score: 0</span>
				</div>
				<div id="shop">
					<div class="item greyed-out" id="instant-health">
						<div class="key">1</div>
						<div class="label">Instant Health</div>
					</div>
				</div>
			</div>
			${ await inlineJS('src/js/gfx.js') }
			${ await inlineJS('src/js/map-bounds.js') }
			${ await inlineJS('src/js/bullet.js') }
			${ await inlineJS('src/js/tank.js') }
			${ await inlineJS('src/js/score-block.js') }
			${ await inlineJS('src/js/player.js') }
			${ await inlineJS('src/js/index.js') }
			`, {
				author: 'Iannis de Zwart',
				description: 'Tank Invasion',
				keywords: [ 'tank', 'invasion', 'game' ]
			}),
			path: '/index.html'
		}
	])
}

main()