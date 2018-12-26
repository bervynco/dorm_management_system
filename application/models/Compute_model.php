<?php
class compute_model extends CI_Model {
    function selectAllBilling($branchId) {
        $query = $this->db->where('branch_id', $branchId)->get('billing');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function getComputeData($branchId){
        $sql = "Select tenant.tenant_id, tenant.room_tenant_id, tenant.tenant_name, room.room_id, room.room_rate, 
        utility_tenant.status, tenant.status, utility.utility_name, utility.utility_amount from tenant 
        LEFT JOIN room_tenant ON room_tenant.room_tenant_id = tenant.room_tenant_id 
        JOIN room on room.room_id = room_tenant.room_id 
        LEFT JOIN utility_tenant on utility_tenant.tenant_id = tenant.tenant_id 
        LEFT JOIN utility on utility.utility_id = utility_tenant.utility_id 
        where tenant.status = 'active' and room.branch_id = ". $branchId;
        $query = $this->db->query($sql);
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }

    function insertBilling($billing){

    }
}

?>

