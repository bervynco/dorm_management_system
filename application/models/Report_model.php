<?php
class report_model extends CI_Model {

    function getInventoryReport($branchId, $selectedReport, $selectedReportType, $month, $year) {
        $this->db->select(array('inventory.*', 'branch.*', 'room.*'));
        $this->db->from('inventory');
        $this->db->join('branch', 'inventory.branch_id = branch.branch_id');
        $this->db->join('room', 'inventory.room_id = room.room_id');
        $this->db->where('inventory.branch_id', $branchId);

        $timestamp = "inventory.timestamp";
        switch($selectedReportType){
            case 'Monthly': $this->db->where('month(' + $timestamp + ')', $month)->where('year(' + $timestamp + ')', year);
            break;
            case 'Quarterly': 
                if($month == 1)
                    $this->db->where('month(' + $timestamp + ')', '>=', 1)->where('month(' + $timestamp + ')', '<=', 3)->where('year(' + $timestamp + ')', $year);
                else if($month == 2)
                    $this->db->where('month(' + $timestamp + ')', '>=', 4)->where('month(' + $timestamp + ')', '<=', 6)->where('year(' + $timestamp + ')', $year);
                else if($month == 3)
                    $this->db->where('month(' + $timestamp + ')', '>=', 7)->where('month(' + $timestamp + ')', '<=', 9)->where('year(' + $timestamp + ')', $year);
                else
                    $this->db->where('month(' + $timestamp + ')', '>=', 10)->where('month(' + $timestamp + ')', '<=', 12)->where('year(' + $timestamp + ')', $year);
            break;
            case 'Yearly': $this->db->where('year(' + $timestamp + ')', year);
            break;
        }
        
        $this->db->get();
    }

    function getUserReport($branchId, $selectedReport, $selectedReportType, $month, $year) {
        $this->db->select(array('user.*', 'user_branch.*', 'role_name'));
        $this->db->from('user');
        $this->db->join('user_branch', 'user.user_id = user_branch.user_id');
        $this->db->join('role', 'user_branch.role_id = role.role_id');
        $this->db->where('user_branch.branch_id', $branchId);

        $timestamp = "user.timestamp";
        switch($selectedReportType){
            case 'Monthly': $this->db->where('month(' + $timestamp + ')', $month)->where('year(' + $timestamp + ')', year);
            break;
            case 'Quarterly': 
                if($month == 1)
                    $this->db->where('month(' + $timestamp + ')', '>=', 1)->where('month(' + $timestamp + ')', '<=', 3)->where('year(' + $timestamp + ')', $year);
                else if($month == 2)
                    $this->db->where('month(' + $timestamp + ')', '>=', 4)->where('month(' + $timestamp + ')', '<=', 6)->where('year(' + $timestamp + ')', $year);
                else if($month == 3)
                    $this->db->where('month(' + $timestamp + ')', '>=', 7)->where('month(' + $timestamp + ')', '<=', 9)->where('year(' + $timestamp + ')', $year);
                else
                    $this->db->where('month(' + $timestamp + ')', '>=', 10)->where('month(' + $timestamp + ')', '<=', 12)->where('year(' + $timestamp + ')', $year);
            break;
            case 'Yearly': $this->db->where('year(' + $timestamp + ')', year);
            break;
        }
        
        $this->db->get();
    }

    function getLogReport($branchId, $selectedReport, $selectedReportType, $month, $year) {
        $this->db->select(array('log.*', 'branch.*'));
        $this->db->from('log');
        $this->db->join('branch', 'log.branch_id = branch.branch_id');
        $this->db->where('log.branch_id', $branchId);

        $timestamp = "log.timestamp";
        switch($selectedReportType){
            case 'Monthly': $this->db->where('month(' + $timestamp + ')', $month)->where('year(' + $timestamp + ')', year);
            break;
            case 'Quarterly': 
                if($month == 1)
                    $this->db->where('month(' + $timestamp + ')', '>=', 1)->where('month(' + $timestamp + ')', '<=', 3)->where('year(' + $timestamp + ')', $year);
                else if($month == 2)
                    $this->db->where('month(' + $timestamp + ')', '>=', 4)->where('month(' + $timestamp + ')', '<=', 6)->where('year(' + $timestamp + ')', $year);
                else if($month == 3)
                    $this->db->where('month(' + $timestamp + ')', '>=', 7)->where('month(' + $timestamp + ')', '<=', 9)->where('year(' + $timestamp + ')', $year);
                else
                    $this->db->where('month(' + $timestamp + ')', '>=', 10)->where('month(' + $timestamp + ')', '<=', 12)->where('year(' + $timestamp + ')', $year);
            break;
            case 'Yearly': $this->db->where('year(' + $timestamp + ')', year);
            break;
        }
        
        $this->db->get();
    }

    function getUtilityReport($branchId, $selectedReport, $selectedReportType, $month, $year) {
        
    }

    function getTenantReport($branchId, $selectedReport, $selectedReportType, $month, $year) {
        
    }

    function getRoomReport($branchId, $selectedReport, $selectedReportType, $month, $year) {
        
    }

    function getPayablesReport($branchId, $selectedReport, $selectedReportType, $month, $year) {
        $this->db->select(array('payables.*', 'branch.*'));
        $this->db->from('payables');
        $this->db->join('branch', 'payables.branch_id = branch.branch_id');
        $this->db->where('payables.branch_id', $branchId);

        $timestamp = "payables.timestamp";
        switch($selectedReportType){
            case 'Monthly': $this->db->where('month(' + $timestamp + ')', $month)->where('year(' + $timestamp + ')', year);
            break;
            case 'Quarterly': 
                if($month == 1)
                    $this->db->where('month(' + $timestamp + ')', '>=', 1)->where('month(' + $timestamp + ')', '<=', 3)->where('year(' + $timestamp + ')', $year);
                else if($month == 2)
                    $this->db->where('month(' + $timestamp + ')', '>=', 4)->where('month(' + $timestamp + ')', '<=', 6)->where('year(' + $timestamp + ')', $year);
                else if($month == 3)
                    $this->db->where('month(' + $timestamp + ')', '>=', 7)->where('month(' + $timestamp + ')', '<=', 9)->where('year(' + $timestamp + ')', $year);
                else
                    $this->db->where('month(' + $timestamp + ')', '>=', 10)->where('month(' + $timestamp + ')', '<=', 12)->where('year(' + $timestamp + ')', $year);
            break;
            case 'Yearly': $this->db->where('year(' + $timestamp + ')', year);
            break;
        }
        
        $this->db->get();
    }

    function getCalendarReport($branchId, $selectedReport, $selectedReportType, $month, $year) {
        
    }

    function getBranchReport($branchId, $selectedReport, $selectedReportType, $month, $year) {
        $this->db->where('branch_id', $branchId);
        $timestamp = "timestamp";

        switch($selectedReportType){
            case 'Monthly': $this->db->where('month(' + $timestamp + ')', $month)->where('year(' + $timestamp + ')', year);
            break;
            case 'Quarterly': 
                if($month == 1)
                    $this->db->where('month(' + $timestamp + ')', '>=', 1)->where('month(' + $timestamp + ')', '<=', 3)->where('year(' + $timestamp + ')', $year);
                else if($month == 2)
                    $this->db->where('month(' + $timestamp + ')', '>=', 4)->where('month(' + $timestamp + ')', '<=', 6)->where('year(' + $timestamp + ')', $year);
                else if($month == 3)
                    $this->db->where('month(' + $timestamp + ')', '>=', 7)->where('month(' + $timestamp + ')', '<=', 9)->where('year(' + $timestamp + ')', $year);
                else
                    $this->db->where('month(' + $timestamp + ')', '>=', 10)->where('month(' + $timestamp + ')', '<=', 12)->where('year(' + $timestamp + ')', $year);
            break;
            case 'Yearly': $this->db->where('year(' + $timestamp + ')', year);
            break;
        }
        
        $this->db->get('branch');
    }

}

?>