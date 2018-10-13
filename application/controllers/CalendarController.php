<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CalendarController extends CI_Controller {

	public function index()
	{
    
	}
    public function assignDataToArray($postData, $arrColumns){
        $insertArray = array();
        foreach($arrColumns as $col){
            $insertArray[$col] = (!empty($postData[$col])) ? $postData[$col] : null;
        }
        return $insertArray;
    }
    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }

    public function getAllCalendar(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrCalendar = $this->calendar_model->selectAllCalendar($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving calendar list", $arrCalendar));
    }

    public function addNewCalendar() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $calendarId = $this->calendar_model->insertNewCalendar($postData);

        if($calendarId != 0){
            $postData['calendar_id'] = $calendarId;
            echo json_encode($this->returnArray(200, "Successfully added new calendar", $postData));
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new calendar"));
        }
    }

     public function editCalendar() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $calendar = $postData;
        $calendarStatus = $this->calendar_model->updateCalendarItem($calendar);

        if($calendarStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully edited calendar item ", $calendar));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error updating calendar item"));
        }
    }

}
