<?php
$act = $_REQUEST['act'];
$db_host = "db.im20.com.cn"; //数据库地址
$db_user = "imuser"; //数据库用户名
$db_pwd = "ad_bp_0320"; //数据库密码
$db_name = "DB_KSD_MLA"; //数据库名称
$db = new mysql ($db_host, $db_user, $db_pwd, $db_name);
$db->open();
if ($act == 'doSaveInfo') {
    $userName = htmlspecialchars($_REQUEST['userName']);
    $mobile = htmlspecialchars($_REQUEST['mobile']);
    $eMail = htmlspecialchars($_REQUEST['eMail']);
    $tableName = 'tb_info';
    //判断是否已经提交过
    $where = "mobile='" . $mobile . "'";
    $isExists = $db->get_one('id', $tableName, $where);
    if (!empty($isExists['id'])) exit(json_encode(array('status' => 2)));
    $arrInput = array(
        'userName' => $userName,
        'mobile' => $mobile,
        'eMail' => $eMail,
        'createTime' => time(),
        'createIp' => get_client_ip()
    );
    $res = $db->insert($arrInput, $tableName, true);
    echo json_encode(array('status' => 1, 'id' => $res));
}else if($act == 'export'){
    if($_SERVER['PHP_AUTH_USER'] !='ksd!@#' || $_SERVER['PHP_AUTH_PW'] != 'ksd!@#'){
        Header("WWW-Authenticate: Basic realm=\"USER LOGIN\"");
        Header("HTTP/1.0 401 Unauthorized");
        print 'Access deny!';
        exit;
    }
    header( "Cache-Control: public" );
    header( "Pragma: public" );
    header("Content-type:application/vnd.ms-excel");
    header("Content-Disposition:attachment;filename=data.csv");
    header('Content-Type:APPLICATION/OCTET-STREAM');
    ob_start();
    $file_str = '';
    $usertype = '';
    $header_str =  iconv("utf-8",'gbk',"id,用户名,手机号,邮箱,参与时间,用户ip\n");
    $data = $db->select('id,userName,mobile,eMail,createTime,createIp', 'tb_info');
    if($data){
        foreach ($data as $row){
            $file_str.= $row['id'].','."{$row['userName']} ".','."{$row['mobile']}".','."{$row['eMail']}".','.date('Y-m-d H:i:s',$row['createTime']).','.$row["createIp"]."\n";
        }
    }else{
        echo "无数据";
    }
    $file_str=  iconv("utf-8",'gbk',$file_str);
    ob_end_clean();
    echo $header_str;
    echo $file_str;
    exit;

}


/**
 * 获取客户端IP地址
 *
 * @param integer $type
 *            返回类型 0 返回IP地址 1 返回IPV4地址数字
 * @return mixed
 */
function get_client_ip($type = 0)
{
    $type = $type ? 1 : 0;
    static $ip = NULL;
    if ($ip !== NULL)
        return $ip [$type];
    if (isset ($_SERVER ['HTTP_X_FORWARDED_FOR'])) {
        $arr = explode(',', $_SERVER ['HTTP_X_FORWARDED_FOR']);
        $pos = array_search('unknown', $arr);
        if (false !== $pos)
            unset ($arr [$pos]);
        $ip = trim($arr [0]);
    } elseif (isset ($_SERVER ['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER ['HTTP_CLIENT_IP'];
    } elseif (isset ($_SERVER ['REMOTE_ADDR'])) {
        $ip = $_SERVER ['REMOTE_ADDR'];
    }
    // IP地址合法验证
    $long = ip2long($ip);
    $ip = $long ? array(
        $ip,
        $long
    ) : array(
        '0.0.0.0',
        0
    );
    return $ip [$type];
}


/**
 *  mysql.class.php 数据库实现类
 * @author fanhong.meng
 */
class mysql
{

    /**
     * 数据库连接资源句柄
     */
    public $link = null;

    /**
     * 最近一次查询资源句柄
     */
    public $lastqueryid = null;
    private $db_host;
    private $db_user;
    private $db_pwd;
    private $db_name;
    private $db_port;
    private $db_pconnect;
    private $db_charset;
    /**
     *  统计数据库查询次数
     */
    public $querycount = 0;

    public function __construct($db_host, $db_user, $db_pwd, $db_name, $db_port = '3306', $db_pconnect = 0, $db_charset = 'utf8')
    {
        $this->db_host = $db_host;
        $this->db_user = $db_user;
        $this->db_pwd = $db_pwd;
        $this->db_name = $db_name;
        $this->db_port = $db_port;
        $this->db_pconnect = $db_pconnect;
        $this->db_charset = $db_charset;
    }

    /**
     * 打开数据库连接,有可能不真实连接数据库
     * @param $config    数据库连接参数
     *
     * @return void
     */
    public function open()
    {
        $this->connect();
    }

    /**
     * 真正开启数据库连接
     *
     * @return void
     */
    public function connect()
    {
        $func = $this->db_pconnect == 1 ? 'mysql_pconnect' : 'mysql_connect';
        if (!$this->link = $func($this->db_host, $this->db_user, $this->db_pwd, 1)) {
            $this->halt('Can not connect to MySQL server');
            return false;
        }

        if ($this->version() > '4.1') {
            $charset = $this->db_charset;
            $serverset = $charset ? "character_set_connection='$charset',character_set_results='$charset',character_set_client=binary" : '';
            $serverset .= $this->version() > '5.0.1' ? ((empty($serverset) ? '' : ',') . " sql_mode='' ") : '';
            $serverset && mysql_query("SET $serverset", $this->link);
        }

        if ($this->db_name && !mysql_select_db($this->db_name, $this->link)) {
            $this->halt('Cannot use database ' . $this->db_name);
            return false;
        }
        $this->database = $this->db_name;
        return $this->link;
    }

    /**
     * 数据库查询执行方法
     * @param $sql 要执行的sql语句
     * @return 查询资源句柄
     */
    private function execute($sql)
    {
        if (!is_resource($this->link)) {
            $this->connect();
        }
        $this->lastqueryid = mysql_query($sql, $this->link) or $this->halt(mysql_error(), $sql);
        $this->querycount++;
        return $this->lastqueryid;
    }

    /**
     * 执行sql查询
     * @param $data        需要查询的字段值[例`name`,`gender`,`birthday`]
     * @param $table        数据表
     * @param $where        查询条件[例`name`='$name']
     * @param $limit        返回结果范围[例：10或10,10 默认为空]
     * @param $order        排序方式    [默认按数据库默认方式排序]
     * @param $group        分组方式    [默认为空]
     * @param $key            返回数组按键名排序
     * @return array        查询结果集数组
     */
    public function select($data, $table, $where = '', $limit = '', $order = '', $group = '', $key = '')
    {
        $where = $where == '' ? '' : ' WHERE ' . $where;
        $order = $order == '' ? '' : ' ORDER BY ' . $order;
        $group = $group == '' ? '' : ' GROUP BY ' . $group;
        $limit = $limit == '' ? '' : ' LIMIT ' . $limit;
        $field = explode(',', $data);
        array_walk($field, array($this, 'add_special_char'));
        $data = implode(',', $field);

        $sql = 'SELECT ' . $data . ' FROM `' . $this->db_name . '`.`' . $table . '`' . $where . $group . $order . $limit;
        $this->execute($sql);
        if (!is_resource($this->lastqueryid)) {
            return $this->lastqueryid;
        }
        $datalist = array();
        while (($rs = $this->fetch_next()) != false) {
            if ($key) {
                $datalist[$rs[$key]] = $rs;
            } else {
                $datalist[] = $rs;
            }
        }
        $this->free_result();
        return $datalist;
    }

    /**
     * 获取单条记录查询
     * @param $data        需要查询的字段值[例`name`,`gender`,`birthday`]
     * @param $table        数据表
     * @param $where        查询条件
     * @param $order        排序方式    [默认按数据库默认方式排序]
     * @param $group        分组方式    [默认为空]
     * @return array/null    数据查询结果集,如果不存在，则返回空
     */
    public function get_one($data, $table, $where = '', $order = '', $group = '')
    {
        $where = $where == '' ? '' : ' WHERE ' . $where;
        $order = $order == '' ? '' : ' ORDER BY ' . $order;
        $group = $group == '' ? '' : ' GROUP BY ' . $group;
        $limit = ' LIMIT 1';
        $field = explode(',', $data);
        array_walk($field, array($this, 'add_special_char'));
        $data = implode(',', $field);

        $sql = 'SELECT ' . $data . ' FROM `' . $this->db_name . '`.`' . $table . '`' . $where . $group . $order . $limit;
        $this->execute($sql);
        $res = $this->fetch_next();
        $this->free_result();
        return $res;
    }

    /**
     * 遍历查询结果集
     * @param $type        返回结果集类型
     *                    MYSQL_ASSOC，MYSQL_NUM 和 MYSQL_BOTH
     * @return array
     */
    public function fetch_next($type = MYSQL_ASSOC)
    {
        $res = mysql_fetch_array($this->lastqueryid, $type);
        if (!$res) {
            $this->free_result();
        }
        return $res;
    }

    /**
     * 释放查询资源
     * @return void
     */
    public function free_result()
    {
        if (is_resource($this->lastqueryid)) {
            mysql_free_result($this->lastqueryid);
            $this->lastqueryid = null;
        }
    }

    /**
     * 直接执行sql查询
     * @param $sql                            查询sql语句
     * @return    boolean/query resource        如果为查询语句，返回资源句柄，否则返回true/false
     */
    public function query($sql)
    {
        return $this->execute($sql);
    }

    /**
     * 执行添加记录操作
     * @param $data        要增加的数据，参数为数组。数组key为字段值，数组值为数据取值
     * @param $table        数据表
     * @return boolean
     */
    public function insert($data, $table, $return_insert_id = false, $replace = false)
    {
        if (!is_array($data) || $table == '' || count($data) == 0) {
            return false;
        }

        $fielddata = array_keys($data);
        $valuedata = array_values($data);
        array_walk($fielddata, array($this, 'add_special_char'));
        array_walk($valuedata, array($this, 'escape_string'));

        $field = implode(',', $fielddata);
        $value = implode(',', $valuedata);

        $cmd = $replace ? 'REPLACE INTO' : 'INSERT INTO';
        $sql = $cmd . ' `' . $this->db_name . '`.`' . $table . '`(' . $field . ') VALUES (' . $value . ')';
        $return = $this->execute($sql);
        return $return_insert_id ? $this->insert_id() : $return;
    }

    /**
     * 获取最后一次添加记录的主键号
     * @return int
     */
    public function insert_id()
    {
        return mysql_insert_id($this->link);
    }

    /**
     * 执行更新记录操作
     * @param $data        要更新的数据内容，参数可以为数组也可以为字符串，建议数组。
     *                        为数组时数组key为字段值，数组值为数据取值
     *                        为字符串时[例：`name`='phpcms',`hits`=`hits`+1]。
     *                        为数组时[例: array('name'=>'phpcms','password'=>'123456')]
     *                        数组可使用array('name'=>'+=1', 'base'=>'-=1');程序会自动解析为`name` = `name` + 1, `base` = `base` - 1
     * @param $table        数据表
     * @param $where        更新数据时的条件
     * @return boolean
     */
    public function update($data, $table, $where = '')
    {
        if ($table == '' or $where == '') {
            return false;
        }

        $where = ' WHERE ' . $where;
        $field = '';
        if (is_string($data) && $data != '') {
            $field = $data;
        } elseif (is_array($data) && count($data) > 0) {
            $fields = array();
            foreach ($data as $k => $v) {
                switch (substr($v, 0, 2)) {
                    case '+=':
                        $v = substr($v, 2);
                        if (is_numeric($v)) {
                            $fields[] = $this->add_special_char($k) . '=' . $this->add_special_char($k) . '+' . $this->escape_string($v, '', false);
                        } else {
                            continue;
                        }

                        break;
                    case '-=':
                        $v = substr($v, 2);
                        if (is_numeric($v)) {
                            $fields[] = $this->add_special_char($k) . '=' . $this->add_special_char($k) . '-' . $this->escape_string($v, '', false);
                        } else {
                            continue;
                        }
                        break;
                    default:
                        $fields[] = $this->add_special_char($k) . '=' . $this->escape_string($v);
                }
            }
            $field = implode(',', $fields);
        } else {
            return false;
        }

        $sql = 'UPDATE `' . $this->db_name . '`.`' . $table . '` SET ' . $field . $where;
        return $this->execute($sql);
    }

    /**
     * 执行删除记录操作
     * @param $table        数据表
     * @param $where        删除数据条件,不充许为空。
     *                        如果要清空表，使用empty方法
     * @return boolean
     */
    public function delete($table, $where)
    {
        if ($table == '' || $where == '') {
            return false;
        }
        $where = ' WHERE ' . $where;
        $sql = 'DELETE FROM `' . $this->db_name . '`.`' . $table . '`' . $where;
        return $this->execute($sql);
    }

    /**
     * 获取最后数据库操作影响到的条数
     * @return int
     */
    public function affected_rows()
    {
        return mysql_affected_rows($this->link);
    }

    /**
     * 获取数据表主键
     * @param $table        数据表
     * @return array
     */
    public function get_primary($table)
    {
        $this->execute("SHOW COLUMNS FROM $table");
        while ($r = $this->fetch_next()) {
            if ($r['Key'] == 'PRI') break;
        }
        return $r['Field'];
    }

    /**
     * 获取表字段
     * @param $table        数据表
     * @return array
     */
    public function get_fields($table)
    {
        $fields = array();
        $this->execute("SHOW COLUMNS FROM $table");
        while ($r = $this->fetch_next()) {
            $fields[$r['Field']] = $r['Type'];
        }
        return $fields;
    }

    /**
     * 检查不存在的字段
     * @param $table 表名
     * @return array
     */
    public function check_fields($table, $array)
    {
        $fields = $this->get_fields($table);
        $nofields = array();
        foreach ($array as $v) {
            if (!array_key_exists($v, $fields)) {
                $nofields[] = $v;
            }
        }
        return $nofields;
    }

    /**
     * 检查表是否存在
     * @param $table 表名
     * @return boolean
     */
    public function table_exists($table)
    {
        $tables = $this->list_tables();
        return in_array($table, $tables) ? 1 : 0;
    }

    public function list_tables()
    {
        $tables = array();
        $this->execute("SHOW TABLES");
        while ($r = $this->fetch_next()) {
            $tables[] = $r['Tables_in_' . $this->config['database']];
        }
        return $tables;
    }

    /**
     * 检查字段是否存在
     * @param $table 表名
     * @return boolean
     */
    public function field_exists($table, $field)
    {
        $fields = $this->get_fields($table);
        return array_key_exists($field, $fields);
    }

    public function num_rows($sql)
    {
        $this->lastqueryid = $this->execute($sql);
        return mysql_num_rows($this->lastqueryid);
    }

    public function num_fields($sql)
    {
        $this->lastqueryid = $this->execute($sql);
        return mysql_num_fields($this->lastqueryid);
    }

    public function result($sql, $row)
    {
        $this->lastqueryid = $this->execute($sql);
        return @mysql_result($this->lastqueryid, $row);
    }

    public function error()
    {
        return @mysql_error($this->link);
    }

    public function errno()
    {
        return intval(@mysql_errno($this->link));
    }

    public function version()
    {
        if (!is_resource($this->link)) {
            $this->connect();
        }
        return mysql_get_server_info($this->link);
    }

    public function close()
    {
        if (is_resource($this->link)) {
            @mysql_close($this->link);
        }
    }

    public function halt($message = '', $sql = '')
    {
        if (true) {
            $this->errormsg = "<b>MySQL Query : </b> $sql <br /><b> MySQL Error : </b>" . $this->error() . " <br /> <b>MySQL Errno : </b>" . $this->errno() . " <br /><b> Message : </b> $message <br />";
            $msg = $this->errormsg;
            echo '<div style="font-size:12px;text-align:left; border:1px solid #9cc9e0; padding:1px 4px;color:#000000;font-family:Arial, Helvetica,sans-serif;"><span>' . $msg . '</span></div>';
            exit;
        } else {
            return false;
        }
    }

    /**
     * 对字段两边加反引号，以保证数据库安全
     * @param $value 数组值
     */
    public function add_special_char(&$value)
    {
        if ('*' == $value || false !== strpos($value, '(') || false !== strpos($value, '.') || false !== strpos($value, '`')) {
            //不处理包含* 或者 使用了sql方法。
        } else {
            $value = '`' . trim($value) . '`';
        }
        if (preg_match("/\b(select|insert|update|delete)\b/i", $value)) {
            $value = preg_replace("/\b(select|insert|update|delete)\b/i", '', $value);
        }
        return $value;
    }

    /**
     * 对字段值两边加引号，以保证数据库安全
     * @param $value 数组值
     * @param $key 数组key
     * @param $quotation
     */
    public function escape_string(&$value, $key = '', $quotation = 1)
    {
        if ($quotation) {
            $q = '\'';
        } else {
            $q = '';
        }
        $value = $q . $value . $q;
        return $value;
    }
}

?>