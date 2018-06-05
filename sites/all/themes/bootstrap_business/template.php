<?php 

/**
 * Page alter.
 */
function bootstrap_business_page_alter($page) {
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
function bootstrap_business_preprocess_html(&$variables) {
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
	
	/**
	* Add Javascript for enable/disable scrollTop action
	*/
	if (theme_get_setting('scrolltop_display', 'bootstrap_business')) {

		drupal_add_js('jQuery(document).ready(function($) { 
		$(window).scroll(function() {
			if($(this).scrollTop() != 0) {
				$("#toTop").fadeIn();	
			} else {
				$("#toTop").fadeOut();
			}
		});
		
		$("#toTop").click(function() {
			$("body,html").animate({scrollTop:0},800);
		});	
		
		});',
		array('type' => 'inline', 'scope' => 'header'));
	}
	//EOF:Javascript
}

/**
 * Override or insert variables into the html template.
 */
function bootstrap_business_process_html(&$vars) {
	// Hook into color.module
	if (module_exists('color')) {
	_color_html_alter($vars);
	}
}

/**
 * Preprocess variables for page template.
 */
function bootstrap_business_preprocess_page(&$vars) {

	/**
	 * insert variables into page template.
	 */
	if($vars['page']['sidebar_first'] && $vars['page']['sidebar_second']) { 
		$vars['sidebar_grid_class'] = 'col-md-2';
		$vars['main_grid_class'] = 'col-md-8';
	} elseif ($vars['page']['sidebar_first'] || $vars['page']['sidebar_second']) {
		$vars['sidebar_grid_class'] = 'col-md-2';
		$vars['main_grid_class'] = 'col-md-10';		
	} else {
		$vars['main_grid_class'] = 'col-md-12';			
	}

	if($vars['page']['header_top_left'] && $vars['page']['header_top_right']) { 
		$vars['header_top_left_grid_class'] = 'col-md-10';
		$vars['header_top_right_grid_class'] = 'col-md-2';
	} elseif ($vars['page']['header_top_right'] || $vars['page']['header_top_left']) {
		$vars['header_top_left_grid_class'] = 'col-md-12';
		$vars['header_top_right_grid_class'] = 'col-md-12';		
	}

	/**
	 * Add Javascript
	 */
	if($vars['page']['pre_header_first'] || $vars['page']['pre_header_second'] || $vars['page']['pre_header_third']) { 
	drupal_add_js('
	function hidePreHeader(){
	jQuery(".toggle-control").html("<a href=\"javascript:showPreHeader()\"><span class=\"glyphicon glyphicon-plus\"></span></a>");
	jQuery("#pre-header-inside").slideUp("fast");
	}

	function showPreHeader() {
	jQuery(".toggle-control").html("<a href=\"javascript:hidePreHeader()\"><span class=\"glyphicon glyphicon-minus\"></span></a>");
	jQuery("#pre-header-inside").slideDown("fast");
	}
	',
	array('type' => 'inline', 'scope' => 'footer', 'weight' => 3));
	}
	//EOF:Javascript
}

/**
 * Override or insert variables into the page template.
 */
function bootstrap_business_process_page(&$variables) {
  // Hook into color.module.
  if (module_exists('color')) {
    _color_page_alter($variables);
  }
}

/**
 * Preprocess variables for block.tpl.php
 */
function bootstrap_business_preprocess_block(&$variables) {
	$variables['classes_array'][]='clearfix';
}

/**
 * Override theme_breadrumb().
 *
 * Print breadcrumbs as a list, with separators.
 */
function bootstrap_business_breadcrumb($variables) {
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
function bootstrap_business_form_alter(&$form, &$form_state, $form_id) {
	if ($form_id == 'search_block_form') {
	    unset($form['search_block_form']['#title']);
	    $form['search_block_form']['#title_display'] = 'invisible';
		$form_default = t('Search this website...');
	    $form['search_block_form']['#default_value'] = $form_default;

		$form['actions']['submit']['#attributes']['value'][] = '';

	 	$form['search_block_form']['#attributes'] = array('onblur' => "if (this.value == '') {this.value = '{$form_default}';}", 'onfocus' => "if (this.value == '{$form_default}') {this.value = '';}" );
	}
}
function bootstrap_business_preprocess_button(&$vars) {
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
function bootstrap_business_menu_tree($variables) {
   return '<nav class="navbar navbar-light"><ul class="nav navbar-nav">' . $variables['tree'] . '</ul></nav>';
}

function bootstrap_business_menu_link(array $variables) {
        $element = $variables['element'];
        //print_r($element);
        $sub_menu = '';
        $dropdown = '';
        if ($element['#below']) {
            $sub_menu = drupal_render($element['#below']);
            $sub_menu = str_replace('nav navbar-nav', 'dropdown-menu', $sub_menu);
            $sub_menu = str_replace('<nav class="navbar navbar-light">', '', $sub_menu);
            $sub_menu = str_replace('</nav>', '', $sub_menu);
            $dropdown = 'class="dropdown"';
            $element['#localized_options']['attributes']['class'][] = 'dropdown-toggle';
            $element['#localized_options']['attributes']['data-toggle'][]='dropdown';
            /*$element['#localized_options']['attributes']['role'][]
            $element['#localized_options']['attributes']['class'][]
            data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"*/
         }
         $output = l($element['#title'], $element['#href'], $element['#localized_options']);
         return '<li ' .$dropdown. ' >' . $output . $sub_menu . "</li>\n";
     }