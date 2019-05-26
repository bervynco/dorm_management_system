<?php
class utility_model extends CI_Model {
    function selectAllUtilityPerTenant($branchId) {
        $sql = "SELECT utility.*, utility_reading.utility_reading_id, utility_reading.current_reading, utility_price.utility_price_id, utility_price.price FROM dorm_management.utility LEFT JOIN utility_reading on utility.utility_id = utility_reading.utility_id LEFT JOIN utility_price on utility.utility_id = utility_price.utility_id where utility_reading.status = 'active' and utility_price.status = 'active'";
        $query = $this->db->query($sql);
        return $query->result_array();
    }
    function selectAllUtilityPerBranch($branchId) {
        $this->db->select(array('utility.*', 'utility_reading.*'));
        $this->db->from('utility_reading');
        $this->db->join('utility', 'utility_reading.utility_id = utility.utility_id');
        $this->db->where('utility.branch_id', $branchId);
        $this->db->where('utility_reading.status', "active");
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function selectAllUtility($branchId) {
        $this->db->select(array('utility.utility_id' ,'utility.utility_name', 'utility.utility_description', 'utility.branch_id'));
        $this->db->from('utility');
        $this->db->where('utility.branch_id', $branchId);
        $this->db->where('utility.status', "active");
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function selectPreviousAndCurrentReading($utilityId, $branchId) {
        $this->db->select(array('utility.*', 'utility_reading.*'));
        $this->db->from('utility_reading');
        $this->db->join('utility', 'utility_reading.utility_id = utility.utility_id');
        $this->db->where('utility_reading.utility_id', $utilityId);
        $this->db->where('utility.branch_id', $branchId);
        $this->db->order_by('utility_reading.timestamp', 'desc');
        $this->db->limit(2);
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function selectCurrentActiveReading($utilityId, $branchId){
        $this->db->select(array('utility.*', 'utility_reading.*'));
        $this->db->from('utility_reading');
        $this->db->join('utility', 'utility_reading.utility_id = utility.utility_id');
        $this->db->where('utility_reading.utility_id', $utilityId);
        $this->db->where('utility.branch_id', $branchId);
        $this->db->where('utility_reading.status', "active");
        $this->db->order_by('utility_reading.timestamp', 'desc');
        $this->db->limit(1);
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function selectPreviousAndCurrentPrice($utilityId, $branchId){
        $this->db->select(array('utility.*', 'utility_price.*'));
        $this->db->from('utility_price');
        $this->db->join('utility', 'utility_price.utility_id = utility.utility_id');
        $this->db->where('utility_price.utility_id', $utilityId);
        $this->db->where('utility.branch_id', $branchId);
        $this->db->order_by('utility_price.timestamp', 'desc');
        $this->db->limit(2);
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function selectCurrentActivePrice($utilityId, $branchId){
        $this->db->select(array('utility.*', 'utility_price.*'));
        $this->db->from('utility_price');
        $this->db->join('utility', 'utility_price.utility_id = utility.utility_id');
        $this->db->where('utility_price.utility_id', $utilityId);
        $this->db->where('utility.branch_id', $branchId);
        $this->db->where('utility_price.status', "active");
        $this->db->order_by('utility_price.timestamp', 'desc');
        $this->db->limit(1);
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function selectAllReadings($utilityId, $branchId){
        $this->db->select(array('utility.*', 'utility_reading.*'));
        $this->db->from('utility_reading');
        $this->db->join('utility', 'utility_reading.utility_id = utility.utility_id');
        $this->db->where('utility_reading.utility_id', $utilityId);
        $this->db->where('utility.branch_id', $branchId);
        $this->db->order_by('utility_reading.timestamp', 'desc');
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function selectAllPricings($utilityId, $branchId){
         $this->db->select(array('utility.*', 'utility_price.*'));
        $this->db->from('utility_price');
        $this->db->join('utility', 'utility_price.utility_id = utility.utility_id');
        $this->db->where('utility_price.utility_id', $utilityId);
        $this->db->where('utility.branch_id', $branchId);
        $this->db->order_by('utility_price.timestamp', 'desc');
        $query = $this->db->get();
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function insertUtility($utility) {
        $query = $this->db->insert('utility', $utility);

        return $this->db->insert_id();
    }

    function updateUtility($utility){
        $query = $this->db->where('utility_id', $utility['utility_id'])
                          ->update('utility', 
                            array(
                                'utility_name'=> $utility['utility_name'], 
                                'utility_description' => $utility['utility_description']
                            )
        );
        return $this->db->affected_rows();
    }

    function updateUtilityStatus($fieldName, $tableName, $utilityId, $status){
        $query = $this->db->where($fieldName, $utilityId)
                            ->update($tableName, 
                            array(
                                'status' => $status
                            )
        );
        return $this->db->affected_rows();
    }
    function deleteUtility($utilityId, $branchId){
        $query = $this->db->where('utility_id', $utilityId)
                        ->where('utility_id', $utilityId)
                        ->where('branch_id', $branchId)
                        ->update('utility_branch', 
                            array(
                                'status' => 'inactive'
                            )
        );
        return $this->db->affected_rows();
    }

    function checkDuplicateUtility($utility) {
        $query = $this->db->where('utility_name', $utility['utility_name'])
                ->where('branch_id', $utility['branch_id'])
                ->where('status','active');
        
        $query = $this->db->get('utility');
        return $query->num_rows();
    }

    function insertUtilityPrice($utility) {
        $query = $this->db->insert('utility_price', $utility);

        return $this->db->insert_id();
    }

    function insertUtilityReading($utility) {
        $query = $this->db->insert('utility_reading', $utility);

        return $this->db->insert_id();
    }
}

?>