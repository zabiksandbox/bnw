<?php

/**
 * @file
 * Handles incoming requests to fire off regularly-scheduled tasks (cron jobs).
 */

/**
 * Root directory of Drupal installation.
 */
define('DRUPAL_ROOT', getcwd());

include_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);



$page=intval($_GET['page']);
db_set_active('oldworld');
$locales=db_query("SELECT * FROM `quest_template_locale` LIMIT ".($page*8000).",8000")->fetchAll();
db_set_active('world');
foreach ($locales as $quest){
		
	db_query("UPDATE locales_quest SET `Title_loc8`='".addslashes($quest->Title)."' WHERE Id='".$quest->ID."'");
	db_query("UPDATE locales_quest SET `Details_loc8`='".addslashes($quest->Details)."' WHERE Id='".$quest->ID."'");
	db_query("UPDATE locales_quest SET `Objectives_loc8`='".addslashes($quest->Objectives)."' WHERE Id='".$quest->ID."'");
	db_query("UPDATE locales_quest SET `OfferRewardText_loc8`='".addslashes($quest->OfferRewardText)."' WHERE Id='".$quest->ID."'");
	db_query("UPDATE locales_quest SET `RequestItemsText_loc8`='".addslashes($quest->RequestItemsText)."' WHERE Id='".$quest->ID."'");
	db_query("UPDATE locales_quest SET `EndText_loc8`='".addslashes($quest->EndText)."' WHERE Id='".$quest->ID."'");
	db_query("UPDATE locales_quest SET `CompletedText_loc8`='".addslashes($quest->CompletedText)."' WHERE Id='".$quest->ID."'");
	
	db_query("UPDATE locales_quest SET `ObjectiveText1_loc8`='".addslashes($quest->ObjectiveText1)."' WHERE Id='".$quest->ID."'");
	db_query("UPDATE locales_quest SET `ObjectiveText2_loc8`='".addslashes($quest->ObjectiveText2)."' WHERE Id='".$quest->ID."'");
	db_query("UPDATE locales_quest SET `ObjectiveText3_loc8`='".addslashes($quest->ObjectiveText3)."' WHERE Id='".$quest->ID."'");
	db_query("UPDATE locales_quest SET `ObjectiveText4_loc8`='".addslashes($quest->ObjectiveText4)."' WHERE Id='".$quest->ID."'");
	
	$true=true;
}
db_set_active('default');

if($true==true){header("Location: /trans.php?page=".($page+1));} else {
	print 'done';
}
?>