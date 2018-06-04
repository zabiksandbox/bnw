<?


function talent_load($char){
	db_set_active('characters');
	$res=db_query("SELECT * FROM `character_talent`  WHERE guid='".$char."'")->fetchAll();
	foreach($res as $k=>$v){
		$talent->{$v->talentGroup}[]=$v->spell;
	}
	db_set_active('default');
	return $talent;
}


function item_load_template($id){
	
	$sqlar=array();
	if($id==0) return false;
	
	db_set_active('world');

	$res=db_query("SELECT * FROM `item_template` WHERE entry='".$id."'")->fetchObject();

	if(!isset($res->icon)){
		@$json=file_get_contents('https://eu.api.battle.net/wow/item/'.$id.'?locale=ru_RU&apikey=m4shnwbx6btcze8gv6pj8ngvzspzt9xw');
		$data=json_decode($json);
		if(isset($data->icon)){
			db_query("UPDATE item_template SET icon='".$data->icon."' WHERE entry='".$id."'");
			$res->icon=$data->icon;
		}
		
	}
	db_set_active('default');
	return $res;
}
function item_load_by_guid($guid){
	if($guid==0) return false;
	db_set_active('characters');
	
	$guiditem=db_query("SELECT * FROM `item_instance` WHERE guid='".$guid."'")->fetchObject();
	db_set_active('default');
	$template=item_load_template($guiditem->itemEntry);
	foreach($guiditem as $k=>$v){
		$template->{$k}=$v;
	}
	return $template;
}


function guildbychar($char){
	if ($cache = cacheget('guild_array'.$char->guid)) {
		$json=$cache->data;
	} else {
		db_set_active('characters');
		$res=db_query("SELECT g.* FROM `guild_member` as gm, guild as g  WHERE gm.guid='".$char->guid."' AND gm.guildid=g.guildid")->fetchObject();
		db_set_active('default');
		$json=json_encode($res);
		cacheset('guild_array'.$char->guid, $json);
	}
	$data=json_decode($json);
	return $data;
}


function wow_online(){
	if ($cache = cacheget('online')) {
		$json=$cache->data;
	} else {
		db_set_active('auth');
		$count=db_query("SELECT COUNT(id) as count FROM account WHERE online=1")->fetchObject();
		db_set_active('default');
		$json=json_encode($count);
		cacheset('online', $json,'cache', time()+300);
	}
	$data=json_decode($json);
	return $data->count.'/6000';
}



function cacheset($key,$data,$table='cache',$lifetime=CACHE_TEMPORARY){
	return cache_set($key, $data, $table, $lifetime);
}

function cacheget($key){
	global $user;
	if($user->uid==1){
		return false;
	}
	return cache_get($key);
	
}
?>