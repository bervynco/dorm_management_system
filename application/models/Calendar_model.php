<?php
class calendar_model extends CI_Model {
    function selectAllCalendar($branchId) {
        $query = $this->db->where('branch_id', $branchId)->get('calendar');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertNewCalendar($calendar) {
        $query = $this->db->insert('calendar', $calendar);

        return $this->db->insert_id();
    }

     function updateCalendarItem($calendar) {
        $query = $this->db->where('calendar_id', $calendar['calendar_id'])
                          ->update('calendar', 
                            array(
                                'calendar_event_name'=> $calendar['calendar_event_name'], 
                                'calendar_description' => $calendar['calendar_description'],
                                'calendar_date' => $calendar['calendar_date'],
                                'branch_id' => $calendar['branch_id']
                            )
        );
        return $this->db->affected_rows();
    }
}

?>