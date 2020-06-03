/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

const fetchFeed = debounce( async ( {
	id,
	didCancel,
    setData,
	setLoading,
} ) => {
	setLoading(true);

	const response = await apiFetch( {
		path: `/innocode/v1/community/feeds/${ id }`,
	} );

	if (!didCancel) {
		setData(response);
		setLoading(false);
	}
}, 800 );

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props] Properties passed from the editor.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { className, attributes, setAttributes } ) {
	const [ id, setId ] = useState( attributes.id );
	const [ data, setData ] = useState( {} );
	const [ isLoading, setLoading ] = useState( false );
	const onChangeFeed = ( value ) => setId( value );

	useEffect( () => {
		let didCancel = false;

		setAttributes( { id } );

		if ( id ) {
			fetchFeed( {
				id,
				didCancel,
				setData,
				setLoading,
			} );
		}

		return () => {
			didCancel = true;
		};
	}, [ id ] );

	// @TODO: render feed

	return (
		<>
			<div
				className={ className }
			>
				<TextControl
					label={ __( 'Feed', 'innocode-community-feed' ) }
					type="number"
					value={ id }
					onChange={ onChangeFeed }
				/>
			</div>
			<div
				id={ `innocode_community_feed-${ id }-root` }
				className="innocode_community_feed"
			>
				{isLoading && __( 'Loading...', 'innocode-community-feed' )}
			</div>
		</>
	);
}
