<?php
class tenant_model extends CI_Model {
    function insertTenant($tenantDetail){
        $query = $this->db->insert('tenant', $tenantDetail);

        return $this->db->insert_id();
    }

    function selectAllTenantsPerBranch($branchId) {
        $query = $this->db->where('branch_id', $branchId)->get('tenant');
        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
}

?>