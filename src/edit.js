/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	Placeholder,
	Spinner,
	TextControl,
	ToolbarGroup,
} from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { pencil } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from 'react';

const fetchFeed = async ( {
	attributes,
	isRequesting,
	setRequesting,
	didUnmount,
	setData,
} ) => {
	if ( isRequesting ) {
		return;
	}

	const { id } = attributes;

	if ( ! id ) {
		return;
	}

	setRequesting( true );

	const response = await apiFetch( {
		path: `/innocode/v1/community/feeds/${ id }`,
	} );

	if ( ! didUnmount ) {
		setData( response );
		setRequesting( false );
	}
};

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
	const [ data, setData ] = useState( {} );
	const [ isRequesting, setRequesting ] = useState( false );
	const [ didUnmount, setDidUnmount ] = useState( false );

	const onChangeFeed = ( value ) => setAttributes( { id: parseInt( value, 10 ) } );

	const onSubmitFeed = async ( event ) => {
		event.preventDefault();
		await fetchFeed( {
			attributes,
			isRequesting,
			setRequesting,
			didUnmount,
			setData,
		} );
	};

	useEffect( () => {
		const initialFetchFeed = async () => {
			await fetchFeed( {
				attributes,
				isRequesting,
				setRequesting,
				didUnmount,
				setData,
			} );
		};

		initialFetchFeed();

		return () => {
			setDidUnmount( true );
		};
	}, [] );

	// @TODO: render feed based on 'data' object
	console.log(data);

	if ( isRequesting ) {
		return (
			<div className="is-loading">
				<Spinner />
				<p>{ __( 'Inserting…', 'innocode-community-feed' ) }</p>
			</div>
		);
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<Button
						className="components-toolbar__control"
						label={ __( 'Edit Feed', 'innocode-community-feed' ) }
						icon={ pencil }
					/>
				</ToolbarGroup>
			</BlockControls>
			<Placeholder>
				<form method="post" onSubmit={ onSubmitFeed }>
					<TextControl
						label={ __( 'Feed', 'innocode-community-feed' ) }
						type="number"
						value={ attributes.id }
						className="components-placeholder__input"
						onChange={ onChangeFeed }
					/>
					<Button isPrimary type="submit">
						{ __( 'Insert', 'innocode-community-feed' ) }
					</Button>
				</form>
			</Placeholder>
			{ ! isRequesting && (
				<div
					id={ `innocode_community_feed-${ attributes.id }-block` }
					className={`${ className } innocode_community_feed`}
				/>
			) }
		</>
	);
}
