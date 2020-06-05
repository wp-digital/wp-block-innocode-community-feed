<?php
/**
 * Plugin Name:     Community Feed Block
 * Description:     Retrieves and displays feed from <a href="https://innocode.com/product/community/">Innocode Community</a>. <strong>Requires</strong> <a href="https://github.com/innocode-digital/wp-innocode-community">Community</a> plugin.
 * Version:         0.1.0
 * Author:          Innocode
 * Author URI:      https://innocode.com
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     innocode-community-feed
 *
 * @package         innocode
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
function innocode_community_feed_block_init() {
	$dir = dirname( __FILE__ );

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "innocode/community-feed" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'innocode-community-feed-block-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);

	$editor_css = 'editor.css';
	wp_register_style(
		'innocode-community-feed-block-editor',
		plugins_url( $editor_css, __FILE__ ),
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'style.css';
	wp_register_style(
		'innocode-community-feed-block',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

	register_block_type( 'innocode/community-feed', [
		'editor_script'   => 'innocode-community-feed-block-editor',
		'editor_style'    => 'innocode-community-feed-block-editor',
		'style'           => 'innocode-community-feed-block',
		'render_callback' => function ( array $attributes ) {
			if ( ! isset( $attributes['id'] ) ) {
				return '';
			}

			$attributes['id'] = (int) $attributes['id'];

			static $block_id = 0;

			$id = 'innocode_community_feed-' . ++$block_id;

			return sprintf(
				"<div id=\"%s-block\" class=\"innocode_community_feed\"></div>
<script>
window.innocodeCommunity = window.innocodeCommunity || {};
window.innocodeCommunity.blocks = window.innocodeCommunity.blocks || {};
window.innocodeCommunity.blocks['%s'] = %s;
</script>",
				esc_attr( $id ),
				esc_attr( $id ),
				json_encode( $attributes )
			);
		},
	] );
}
add_action( 'init', 'innocode_community_feed_block_init' );
