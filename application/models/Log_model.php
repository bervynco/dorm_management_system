<?php
class log_model extends CI_Model {
    function selectAllLogsPerBranch($branchId) {
        $this->db->select(array('log.user_id', 'log.page_name', 'log.page_action', 'log.timestamp', 'log.branch_id', 'user.username', 'user.name'));
        $this->db->from('log');
        $this->db->join('user', 'log.user_id = user.user_id');
        $this->db->where('log.branch_id', $branchId);
        $this->db->order_by('log.timestamp', "desc");
        $query = $this->db->get();

        return ($query->num_rows() > 0) ? $query->result_array(): array();
    }
    function insertLogItem($log) {
        $query = $this->db->insert('log', $log);

        return $this->db->insert_id();
    }

}

?>