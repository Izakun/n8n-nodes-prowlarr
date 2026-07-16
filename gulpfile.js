const { src, dest, parallel } = require('gulp');

// `encoding: false` is required on gulp 5 so binary icons (PNG) are not corrupted;
// harmless for SVG. Keeps icon copying safe across formats.
function nodeIcons() {
	return src('nodes/**/*.{png,svg}', { encoding: false }).pipe(dest('dist/nodes'));
}

function credentialIcons() {
	return src('credentials/**/*.{png,svg}', { allowEmpty: true, encoding: false }).pipe(
		dest('dist/credentials'),
	);
}

exports['build:icons'] = parallel(nodeIcons, credentialIcons);
