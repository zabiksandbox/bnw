<?php 

/**
 * Page alter.
 */
function bnwall_page_alter($page) {
	$mobileoptimized = array(
		'#type' => 'html_tag',
		'#tag' => 'meta',
		'#attributes' => array(
		'name' =>  'MobileOptimized',
		'content' =>  'width'
		)
	);
	$handheldfriendly = array(
		'#type' => 'html_tag',
		'#tag' => 'meta',
		'#attributes' => array(
		'name' =>  'HandheldFriendly',
		'content' =>  'true'
		)
	);
	$viewport = array(
		'#type' => 'html_tag',
		'#tag' => 'meta',
		'#attributes' => array(
		'name' =>  'viewport',
		'content' =>  'width=device-width, initial-scale=1'
		)
	);
	drupal_add_html_head($mobileoptimized, 'MobileOptimized');
	drupal_add_html_head($handheldfriendly, 'HandheldFriendly');
	drupal_add_html_head($viewport, 'viewport');
}

/**
 * Preprocess variables for html.tpl.php
 */
function bnwall_preprocess_html(&$variables) {
	/**
	 * Add IE8 Support
	 */
	drupal_add_css(path_to_theme() . '/css/ie8.css', array('group' => CSS_THEME, 'browsers' => array('IE' => '(lt IE 9)', '!IE' => FALSE), 'preprocess' => FALSE));
    
	/**
	* Bootstrap CDN
	*/
    
    if (theme_get_setting('bootstrap_css_cdn', 'bootstrap_business')) {
        $cdn = '//maxcdn.bootstrapcdn.com/bootstrap/' . theme_get_setting('bootstrap_css_cdn', 'bootstrap_business')  . '/css/bootstrap.min.css';
        $cdn = '//stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css';
        drupal_add_css($cdn, array('type' => 'external'));
    }
    
    if (theme_get_setting('bootstrap_js_cdn', 'bootstrap_business')) {
        $cdn = '//maxcdn.bootstrapcdn.com/bootstrap/' . theme_get_setting('bootstrap_js_cdn', 'bootstrap_business')  . '/js/bootstrap.min.js';
        
        $cdn = '//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js';
        drupal_add_js($cdn, array('type' => 'external'));
        
        
        $cdn = '//stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js';
        drupal_add_js($cdn, array('type' => 'external'));

    }
}

/**
 * Preprocess variables for page template.
 */
function bnwall_preprocess_page(&$vars) {

	/**
	 * insert variables into page template.
	 */
	if($vars['page']['leftbar'] && $vars['page']['rightbar']) { 
		$vars['sidebar_grid_class'] = 'col-md-2';
		$vars['main_grid_class'] = 'col-md-8';
	} elseif ($vars['page']['leftbar'] || $vars['page']['rightbar']) {
		$vars['sidebar_grid_class'] = 'col-md-2';
		$vars['main_grid_class'] = 'col-md-10';		
	} else {
		$vars['main_grid_class'] = 'col-md-12';			
	}
	
	$vars['primary_local_tasks'] = $vars['tabs'];
  unset($vars['primary_local_tasks']['#secondary']);
  $vars['secondary_local_tasks'] = array(
    '#theme' => 'menu_local_tasks',
    '#secondary' => $vars['tabs']['#secondary'],
  );
}



/**
 * Override theme_breadrumb().
 *
 * Print breadcrumbs as a list, with separators.
 */
function bnwall_breadcrumb($variables) {
	$breadcrumb = $variables['breadcrumb'];

	if (!empty($breadcrumb)) {
		$breadcrumb[] = drupal_get_title();
		$breadcrumbs = '<ol class="breadcrumb">';

		$count = count($breadcrumb) - 1;
		foreach ($breadcrumb as $key => $value) {
		$breadcrumbs .= '<li>' . $value . '</li>';
		}
		$breadcrumbs .= '</ol>';

		return $breadcrumbs;
	}
}

/**
 * Search block form alter.
 */
function bnwall_preprocess_button(&$vars) {
  $vars['element']['#attributes']['class'][] = 'btn';

	if (isset($vars['element']['#value'])) {
		$classes = array(
			//specifics
			t('Save and add') => 'btn-info',
			t('Add another item') => 'btn-info',
			t('Add effect') => 'btn-primary',
			t('Add and configure') => 'btn-primary',
			t('Update style') => 'btn-primary',
			t('Download feature') => 'btn-primary',

			//generals
			t('Clear all caches')  => 'btn-primary',
			t('Save') => 'btn-success',
			t('Apply') => 'btn-primary',
			t('Create') => 'btn-primary',
			t('Confirm') => 'btn-success',
			t('Submit') => 'btn-success',
			t('Export') => 'btn-primary',
			t('Import') => 'btn-primary',
			t('Restore') => 'btn-primary',
			t('Rebuild') => 'btnprimary',
			t('Search') => 'btn-primary',
			t('Book Event') => 'btn-primary',
			t('Add') => 'btn-info',
			t('Update') => 'btn-info',
			t('Delete') => 'btn-danger',
			t('Remove') => 'btn-danger',
		);
		foreach ($classes as $search => $class) {
			if (strpos($vars['element']['#value'], $search) !== FALSE) {
				$vars['element']['#attributes']['class'][] = $class;
				break;
			}
		}
	}
}
function bootstrap_menu($name, $vertical=false){
	$data=array();
	$menu=db_query("SELECT * FROM `menu_custom` WHERE `menu_name`='".$name."'")->fetch();
	
	$menuarr=get_children_menu($menu->menu_name,0);
	
	
	
	
	$output='<nav class="navbar navbar-expand-md navbar-dark '.($vertical==true?'flex-md-column':'').'">
		<a href="/">'.$menu->title.'</a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#'.$menu->menu_name.'" aria-controls="'.$menu->menu_name.'" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
   	<div class="collapse navbar-collapse" id="'.$menu->menu_name.'">'.render_menu_ul($menuarr,$vertical).'</div></nav>';
   	return $output;
	
}
function get_children_menu($menuname,$plid=0){
	$menuarr=db_query("SELECT * FROM `menu_links` WHERE  `menu_name`='".$menuname."' AND plid='".$plid."' AND hidden=0 ORDER BY weight ASC")->fetchAll();
	foreach($menuarr as $key=>$menu){
		if($menu->has_children==1){
			$menuarr[$key]->children=get_children_menu($menuname,$menu->mlid);
		}

	}
	
	return $menuarr;
}
function render_menu_ul($menuarr,$vertical=false){
	
	$tree='';
	foreach($menuarr as $menus){
		//print '<pre>'.print_r($menus,1).'</pre>';
		$tree.='<li class="nav-item '.(isset($menus->children)?'dropdown':'').'">
				<a 
						class="nav-link '.(isset($menus->children)?'dropdown-toggle':'').'" 
						href="'.url($menus->link_path).'" 
						
					
					>
					'.$menus->link_title.'
					</a>
			';
			if(isset($menus->children)){
				$tree.='
				<div class="dropdown-menu" >';
					$tree.=render_menu_ul($menus->children,$vertical);
				$tree.='
				</div>';
				
			}
		$tree.='
		</li>';
		
	}
	
	
	$output='
	<ul class="navbar-nav '.($vertical==true?'flex-md-column':'').'">
		'.$tree.'
	</ul>';
	
	return $output;
}
function bnwall_menu_tree($variables) {
	if(isset($variables['#tree']['#block']->delta)){
		
	
	$menu=db_query("SELECT * FROM `menu_custom` WHERE `menu_name`='".$variables['#tree']['#block']->delta."'")->fetch();
	
	
	if(isset($menu->title)){
		$title='<a class="navbar-brand" href="#">'.$menu->title.'</a>';
	} else {
		$title='';
	}
	//print '<pre>'.print_r($menu,1).'</pre>';
   return '
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		'.$title.'
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#'.$menu->menu_name.'" aria-controls="'.$menu->menu_name.'" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
   	<div class="collapse navbar-collapse" id="'.$menu->menu_name.'"><ul class="navbar-nav mr-auto">' . $variables['tree'] . '</ul></div>';
   	}
}


function bnwall_menu_link(array $variables) {
	$element = $variables['element'];
	//print_r($element);
	$sub_menu = '';
	$liclass = 'nav-item';
	$aclass = 'nav-link';
	if ($element['#below']) {
		print 'dota '.$element['#title'];
		$aclass.=' dropdown-toggle';
		$liclass.=' dropdown';
	}
	//$output = l($element['#title'], , $element['#localized_options']);
	$output = '<a href="'.url($element['#href']).'" class="'.$aclass.'">'.$element['#title'].'</a>';
	return '<li class="' .$liclass. '">' . $output . $sub_menu . "</li>\n";
}
