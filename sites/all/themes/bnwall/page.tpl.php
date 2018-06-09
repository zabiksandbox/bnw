<div class='row ssticky'>
	<div class='col-md-12 presticky'>
	<div class=''>

    	<div id="header" class="sidebar">
        	<?php //print render($page['header']); ?>
        	<?php print bootstrap_menu('main-menu',false);?>
		</div>

    </div>
    </div>
</div>
<div class='row'>
	<div class='col-md-2 presticky'>
	<div class='sticky'>

    	<div id="leftbar" class="sidebar">
        	<?php 
        	
        	print bootstrap_menu('user-menu',true);
        	print bootstrap_menu('management',true);
        	
        	
        	print render($page['leftbar']); ?>
		</div>

    </div>
    </div>
    <div class='col-md-10'>
		<div id="branding" class="clearfix">
			<?php print $breadcrumb; ?>
			<?php print render($title_prefix); ?>
			<?php if ($title): ?>
			<h1 class="page-title"><?php print $title; ?></h1>
			<?php endif; ?>
			<?php print render($title_suffix); ?>
			<?php print render($primary_local_tasks); ?>
		</div>

		<div id="page">
			<?php if ($secondary_local_tasks): ?>
			<div class="tabs-secondary clearfix"><?php print render($secondary_local_tasks); ?></div>
			<?php endif; ?>

			<div id="content" class="clearfix">
				<div class="element-invisible"><a id="main-content"></a></div>
				<?php if ($messages): ?>
				<div id="console" class="clearfix"><?php print $messages; ?></div>
				<?php endif; ?>
				<?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
				<?php print render($page['content']); ?>
			</div>
	  	</div>
  	</div>
</div>