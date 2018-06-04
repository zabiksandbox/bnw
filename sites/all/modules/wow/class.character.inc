<?php
class Character{    
	private $guid;
	public function __construct($query){
		if(is_numeric($query)){
			$this->guid=$query;	
		} else {
			$this->guid=$this->getID($query);	
		}
	}	
		
	private function getID($query){
		db_set_active('characters');
		$res=db_query("SELECT * FROM `characters` WHERE name='".$query."'")->fetchObject();
		db_set_active('default');
		return $res->guid;
	}
	
	public function loadInfo(){
		if ($cache = cacheget('charinfo'.$this->guid)) {
			$json=$cache->data;
		} else {
			db_set_active('characters');
			$res=db_query("SELECT * FROM `characters` WHERE guid='".$this->guid."'")->fetchObject();
			db_set_active('default');
			
			$json=json_encode($res);
			cacheset('charinfo'.$this->guid, $json);
		}
		$data=json_decode($json);
		return $data;
	}
	
	public function loadInventar(){
		if ($cache = cacheget('charinventar'.$this->guid)) {
			$json=$cache->data;
		} else {
			$inventry=new stdClass();
			db_set_active('characters');
			$res=db_query("SELECT * FROM `character_inventory` WHERE guid='".$this->guid."' AND bag=0")->fetchAll();		
			foreach($res as $int){
				$item=item_load_by_guid($int->item);
					$inventry->{$int->slot}=$item;
			}
			db_set_active('default');
			
			$json=json_encode($inventry);
			cacheset('charinventar'.$this->guid, $json);
		}
		$data=json_decode($json);
		return $data;
	}
	public function loadBags(){
		if ($cache = cacheget('charbags'.$this->guid)) {
			$json=$cache->data;
		} else {
			$inventry=array();
			db_set_active('characters');
			$res=db_query("SELECT * FROM `character_inventory` WHERE guid='".$this->guid."' AND bag>0")->fetchAll();		
			foreach($res as $int){
				$item=item_load_by_guid($int->item);
				$inventry[]=$item;		
			}
			db_set_active('default');
			
			$json=json_encode($inventry);
			cacheset('charbags'.$this->guid, $json);
		}
		$data=json_decode($json);
		return $data;
	}
		
}
?>