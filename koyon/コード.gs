
var url = "https://api.el-drado.com/machine/detailSlot";
var purl = "https://api.el-drado.com/machine/detailPachinko";
var headers = {
  'Connection': 'keep-alive',
  'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
  'DNT': '1',
  'sec-ch-ua-mobile': '?0',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
  'Content-Type': 'application/json;charset=UTF-8',
  'Accept': 'application/json, text/plain, */*',
  'ir-ticket': '4e33eb8cb59f1f1a74774484cb59ee51ee326004',
  'sec-ch-ua-platform': '"Windows"',
  'Origin': 'https://el-drado.com',
  'Sec-Fetch-Site': 'same-site',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Dest': 'empty',
  'Referer': 'https://el-drado.com',
  'Accept-Language': 'ja-JP,ja;q=0.9',
}
var data_for_write = []
function set_day_trigger(min){
  clear_trigger()
  for(i =10;i<23;i++){
    const time = new Date();
    time.setHours(i);
    time.setMinutes(min);
    ScriptApp.newTrigger('get_day_data').timeBased().at(time).create();
  }
}
function set_night_trigger(min){
  clear_trigger()
  set_get_last_night_data_trigger()
  for(j =22;j<25;j++){
    const time = new Date();
    time.setHours(j);
    time.setMinutes(min);
    ScriptApp.newTrigger('get_night_data').timeBased().at(time).create();
  }
  for(k =1;k<10;k++){
  const time = new Date();
  var day = time.getDate()
  time.setDate(day + 1)
  time.setHours(k);
  time.setMinutes(min);
  ScriptApp.newTrigger('get_night_data').timeBased().at(time).create();
  }
  const time = new Date();
  var day = time.getDate()
  time.setDate(day + 1)
  time.setHours(10);
  time.setMinutes(min);
  ScriptApp.newTrigger('get_day_data').timeBased().at(time).create();
}
function set_get_last_night_data_trigger(){
  const time = new Date();
  time.setHours(22);
  time.setMinutes(10);
  ScriptApp.newTrigger('get_yesterday_night_data').timeBased().at(time).create();
}

function clear_trigger(){
  const triggers = ScriptApp.getProjectTriggers();
  for(const trigger of triggers){
     if(trigger.getHandlerFunction() == "get_night_data" || trigger.getHandlerFunction() == "get_yesterday_night_data" ||trigger.getHandlerFunction() == "get_day_data" ){
      ScriptApp.deleteTrigger(trigger);
    }
  }
}

function set_trigger_night_zero_min(){
  set_night_trigger(0)
}
function set_trigger_night_ten_min(){
  set_night_trigger(10)
}
function set_trigger_night_two_ten_min(){
  set_night_trigger(20)
}
function set_trigger_night_three_ten_min(){
  set_night_trigger(30)
}
function set_trigger_night_four_ten_min(){
  set_night_trigger(10)
}
function set_trigger_night_five_ten_min(){
  set_night_trigger(50)
}


function set_trigger_day_zero_min(){
  set_day_trigger(0)
}
function set_trigger_day_ten_min(){
  set_day_trigger(10)
}
function set_trigger_day_two_ten_min(){
  set_day_trigger(20)
}
function set_trigger_day_three_ten_min(){
  set_day_trigger(30)
}
function set_trigger_day_four_ten_min(){
  set_day_trigger(10)
}
function set_trigger_day_five_ten_min(){
  set_day_trigger(50)
}


function get_datasheat_id(fol_id){
  //id���擾����t�H���_�̎w��
  const folderId = DriveApp.getFolderById(fol_id);
  //�w�肵���t�H���_���̂��ׂẴt�@�C�����i�[
  const files = folderId.getFiles();

  //�f�[�^���i�[����z��̐錾
  const arr = [];

  //2�����z��Ƃ��Ēǉ�
  //�t�H���_���̂��ׂẴt�@�C���ɂ��Ď��s
  while (files.hasNext()) {
    //���ׂẴt�@�C������P���o��
    const file = files.next();
  
    //�z��Ƀt�@�C���̃f�[�^��ǉ�
    //getName�F�t�@�C���̖��O�AgetId�F�t�@�C����ID�AgetUrl:�t�@�C����URL
    arr.push([file.getName(),file.getId(),file.getUrl()]);
  }
  //�f�[�^���i�[�����z��arr�̊m�F
  console.log(arr);
  return arr
}
function get_w_rose_data(hall, floor, rate, mode) {
  if (hall == "da") {
    hall = "100100002"
    floor_id = '1003000' + floor
    m_id = 100500000
  }

  if (hall == "ni") {
    hall = "100100003"
    floor_id = '1003300' + floor
    m_id = 100530000
  }
  data_arr = {}
  for (var i = 1; i <= 40; i++) {
    if (floor == 1) {
      daiban = i
    } else {
      daiban = (Number(floor) - 1) * 40 + i
    }
    machine_id = String(m_id + daiban)

    var data = {
      "mst_hall_id": hall,
      "mst_floor_id": floor_id,
      "mst_machine_id": machine_id
    }
    var options = {
      "method": "post",
      "payload": JSON.stringify(data),
      "headers": headers
    }
    var res = UrlFetchApp.fetch(url, options);
    var res_json = JSON.parse(res.getContentText())
    bonus_at_data = res_json['body']['slot_detail'][mode]['bonus_history']
    total_spin = res_json['body']['slot_detail'][mode]['total_spin_count']
    bonus_count = bonus_at_data.length
    bb_count = 0
    rb_count = 0
    bb_hit_ave = 0
    rb_hit_ave = 0
    total_ave = 0
    direct_bb_count = 0
    continue_spin_count = 0
    direct_bb_ave = 0
    hist_log = ""
    if (bonus_count != 0) {
      for (var log = 0; log < bonus_count; log++) {
        if (bonus_at_data[log]["type"] == 1) {
          hist_log += String(bonus_at_data[log]["spin"]) + "B,"
        } else {
          hist_log += String(bonus_at_data[log]["spin"]) + "R,"
        }
      }
    }

    rb_spin_count = 0
    for (var j = 0; j < bonus_count; j++) {
      bonus_type = Number(res_json['body']['slot_detail'][mode]['bonus_history'][j]['type'])
      if (Number(bonus_at_data[j]['spin']) > 33) {
        if (bonus_type == 1) {
          direct_bb_count += 1
          bb_count += 1
        }
      }
      if (Number(bonus_at_data[j]['spin']) < 33) {
        continue_spin_count += Number(bonus_at_data[j]['spin'])
      }
      if (bonus_type == 1) {
        bb_count += 1
      }
      if (bonus_type == 2) {
        rb_count += 1
        rb_spin_count += Number(bonus_at_data[j]['spin'])
      }
    }
    if (bonus_count != 0) {
      if (bb_count != 0) {
        bb_hit_ave = total_spin / bb_count
      }
      if (rb_count != 0) {
        rb_hit_ave = rb_spin_count / rb_count
      }
    }
    today_medal = res_json['body']['slot_detail'][mode]['medal']
    var today = new Date();
    /*�擾�������t�𐼗���ŕ\������formatdate�ɑ��*/
    var formatDate = Utilities.formatDate(today, "JST", "yyyy�NM��d��");
    var time_now = Utilities.formatDate(today, "JST", "HH:mm");
    if (bonus_count != 0) {
      total_ave = total_spin / bonus_count
    }
    if (direct_bb_count != 0) {
      direct_bb_ave = (total_spin - continue_spin_count) / direct_bb_count
    }
    data_arr[i] = [formatDate,
      time_now,
      floor,
      "�E�B�b�`" + rate,
      i,
      total_spin,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      today_medal,
      hist_log,
      "",
      "",
      "",
      ""]
  }
  return data_arr
}
function get_s_rose_data(hall, floor, rate, mode) {
  if (hall == "da") {
    hall = "100100002"
    floor_id = '1003000' + floor
    m_id = 100500000
  }

  if (hall == "ni") {
    hall = "100100003"
    floor_id = '1003300' + floor
    m_id = 100530000
  }
  data_arr = {}
  for (var i = 1; i <= 40; i++) {
    if (floor == 1) {
      daiban = i
    } else {
      daiban = (Number(floor) - 1) * 40 + i
    }
    machine_id = String(m_id + daiban)

    var data = {
      "mst_hall_id": hall,
      "mst_floor_id": floor_id,
      "mst_machine_id": machine_id
    }
    var options = {
      "method": "post",
      "payload": JSON.stringify(data),
      "headers": headers
    };
    var res = UrlFetchApp.fetch(url, options);
    var res_json = JSON.parse(res.getContentText())
    bonus_at_data = res_json['body']['slot_detail'][mode]['bonus_history']
    total_spin = res_json['body']['slot_detail'][mode]['total_spin_count']
    var slump = res_json['body']['slot_detail'][mode]['slump_graph']
    var go_to_mode_b = 0
    var go_to_mode_b_ratio = 0
    var base_game = 0
    var mode_flag = 0
    var in_medal = 0
    var out_medal = 0
    bb_count = 0
    rb_count = 0
    bb_hit_ave = 0
    rb_hit_ave = 0
    total_ave = 0
    normal_b_count = 0
    normal_spin_count = 0
    continue_b_count = 0
    continue_spin_count = 0
    first_hit_ave = 0
    bonus_count = bonus_at_data.length
    hist_log = ""
    if (bonus_count != 0) {
      for (var log = 0; log < bonus_count; log++) {
        if (bonus_at_data[log]["type"] == 1) {
          hist_log += String(bonus_at_data[log]["spin"]) + "B,"
        } else {
          hist_log += String(bonus_at_data[log]["spin"]) + "R,"
        }
      }
    }

    for (var j = 0; j < bonus_count; j++) {
      if (Number(bonus_at_data[j]['spin']) > 33) {
        mode_flag = 0
        normal_b_count += 1
        normal_spin_count += Number(bonus_at_data[j]['spin'])
      }
      if (Number(bonus_at_data[j]['spin']) < 33) {
        continue_b_count += 1
        continue_spin_count += Number(bonus_at_data[j]['spin'])
        if (j != 0){
          if(Number(bonus_at_data[j-1]['spin']) < 33 && bonus_at_data[j-1]["type"] == 1 && mode_flag != 1){
            mode_flag = 1
            go_to_mode_b += 1
          }
        }
      }
      bonus_type = Number(res_json['body']['slot_detail'][mode]['bonus_history'][j]['type'])
      if (bonus_type == 1) {
        bb_count += 1
      }
      if (bonus_type == 2) {
        rb_count += 1
      }
    }
    if (bonus_count != 0) {
      total_ave = total_spin / bonus_count
      if (bb_count != 0) {
        bb_hit_ave = total_spin / bb_count
      }
      if (rb_count != 0) {
        rb_hit_ave = total_spin / rb_count
      }
    }
    if (go_to_mode_b != 0) {
      go_to_mode_b_ratio = go_to_mode_b/normal_b_count

    }
    continue_b_ave = 0
    if (normal_b_count != 0) {
      first_hit_ave = normal_spin_count / normal_b_count
    }
    if (continue_b_count != 0) {
      continue_b_ave = continue_spin_count / continue_b_count
    }
    today_medal = res_json['body']['slot_detail'][mode]['medal']
    var today = new Date();
    /*�擾�������t�𐼗���ŕ\������formatdate�ɑ��*/
    var formatDate = Utilities.formatDate(today, "JST", "yyyy�NM��d��");
    var time_now = Utilities.formatDate(today, "JST", "HH:mm");
    out_medal = bb_count * 307 + rb_count * 126
    var spend_medal = out_medal - Number(today_medal)
    var game_per_medal = 0
    if (total_spin != 0){
      game_per_medal = spend_medal/total_spin
    }
    if (game_per_medal != 0){
      base_game = 50/game_per_medal
    }
    data_arr[i] = [formatDate,
      time_now,
      floor,
      "�V�N��" + rate,
      i,
      total_spin,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      today_medal,
      hist_log]
    console.log(data_arr[i])
  }
  return data_arr
}
function get_peach_data(hall, floor, rate, mode) {
  if (hall == "da") {
    hall = "100100002"
    floor_id = '1003000' + floor
    m_id = 100500000
  }

  if (hall == "ni") {
    hall = "100100003"
    floor_id = '1003300' + floor
    m_id = 100530000
  }
  data_arr = {}
  for (var i = 1; i <= 40; i++) {
    if (floor == 1) {
      daiban = i
    } else {
      daiban = (Number(floor) - 1) * 40 + i
    }
    machine_id = String(m_id + daiban)

    var data = {
      "mst_hall_id": hall,
      "mst_floor_id": floor_id,
      "mst_machine_id": machine_id
    }
    var options = {
      "method": "post",
      "payload": JSON.stringify(data),
      "headers": headers
    }
    var res = UrlFetchApp.fetch(url, options);
    var res_json = JSON.parse(res.getContentText())
    bonus_at_data = res_json['body']['slot_detail'][mode]['bonus_history']
    total_spin = res_json['body']['slot_detail'][mode]['total_spin_count']
    bonus_count = bonus_at_data.length
    bb_count = 0
    rb_count = 0
    at_count = 0
    bb_hit_ave = 0
    rb_hit_ave = 0
    at_hit_ave = 0
    total_ave = 0
    hist_log = ""
    if (bonus_count != 0) {
      for (var log = 0; log < bonus_count; log++) {
        if (bonus_at_data[log]["type"] == 1) {
          hist_log += String(bonus_at_data[log]["spin"]) + "B,"
        } else if (bonus_at_data[log]["type"] == 3) {
          hist_log += String(bonus_at_data[log]["spin"]) + "AT,"
        } else {
          hist_log += String(bonus_at_data[log]["spin"]) + "R,"
        }
      }
    }
    for (var j = 0; j < bonus_count; j++) {
      bonus_type = Number(res_json['body']['slot_detail'][mode]['bonus_history'][j]['type'])
      if (bonus_type == 1) {
        bb_count += 1
      }
      if (bonus_type == 2) {
        rb_count += 1
      }
      if (bonus_type == 3) {
        at_count += 1
      }
    }
    if (bonus_count != 0) {
      if (bb_count != 0) {
        bb_hit_ave = total_spin / bb_count
      }
      if (rb_count != 0) {
        rb_hit_ave = total_spin / rb_count
      }
      if (at_count != 0) {
        at_hit_ave = total_spin / at_count
      }
    }
    today_medal = res_json['body']['slot_detail'][mode]['medal']
    var today = new Date();
    /*�擾�������t�𐼗���ŕ\������formatdate�ɑ��*/
    var formatDate = Utilities.formatDate(today, "JST", "yyyy�NM��d��");
    var time_now = Utilities.formatDate(today, "JST", "HH:mm");
    if (bonus_count != 0) {
      total_ave = total_spin / bonus_count
    }
    data_arr[i] = [formatDate,
      time_now,
      floor,
      "�s�[�`" + rate,
      i,
      total_spin,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      today_medal,
      hist_log,
      "",
      "",
      "",
      ""]
    console.log(data_arr[i])
  }
  return data_arr
}
function get_rich_data(hall, floor, rate, mode) {
  if (hall == "da") {
    hall = "100100002"
    floor_id = '1003000' + floor
    m_id = 100500000
  }

  if (hall == "ni") {
    hall = "100100003"
    floor_id = '1003300' + floor
    m_id = 100530000
  }
  data_arr = {}
  for (var i = 1; i <= 40; i++) {
    if (floor == 1) {
      daiban = i
    } else {
      daiban = (Number(floor) - 1) * 40 + i
    }
    machine_id = String(m_id + daiban)

    var data = {
      "mst_hall_id": hall,
      "mst_floor_id": floor_id,
      "mst_machine_id": machine_id
    }
    var options = {
      "method": "post",
      "payload": JSON.stringify(data),
      "headers": headers
    }
    var res = UrlFetchApp.fetch(url, options);
    var res_json = JSON.parse(res.getContentText())
    bonus_at_data = res_json['body']['slot_detail'][mode]['bonus_history']
    total_spin = res_json['body']['slot_detail'][mode]['total_spin_count']
    bonus_count = bonus_at_data.length
    bb_count = 0
    rb_count = 0
    bb_hit_ave = 0
    rb_hit_ave = 0
    total_ave = 0
    hist_log = ""
    if (bonus_count != 0) {
      for (var log = 0; log < bonus_count; log++) {
        if (bonus_at_data[log]["type"] == 1) {
          hist_log += String(bonus_at_data[log]["spin"]) + "B,"
        } else {
          hist_log += String(bonus_at_data[log]["spin"]) + "R,"
        }
      }
    }
    for (var j = 0; j < bonus_count; j++) {
      bonus_type = Number(res_json['body']['slot_detail'][mode]['bonus_history'][j]['type'])
      if (bonus_type == 1) {
        bb_count += 1
      }
      if (bonus_type == 2) {
        rb_count += 1
      }
    }
    if (bonus_count != 0) {
      if (bb_count != 0) {
        bb_hit_ave = total_spin / bb_count
      }
      if (rb_count != 0) {
        rb_hit_ave = total_spin / rb_count
      }
    }
    today_medal = res_json['body']['slot_detail'][mode]['medal']
    var today = new Date();
    /*�擾�������t�𐼗���ŕ\������formatdate�ɑ��*/
    var formatDate = Utilities.formatDate(today, "JST", "yyyy�NM��d��");
    var time_now = Utilities.formatDate(today, "JST", "HH:mm");
    if (bonus_count != 0) {
      total_ave = total_spin / bonus_count
    }
    data_arr[i] = [formatDate,
      time_now,
      floor,
      "���b�`" + rate,
      i,
      total_spin,
      "",
      "",
      "",
      "",
      "",
      today_medal,
      hist_log,
      "",
      "",
      "",
      "",
      "",
      ""]
    console.log(data_arr[i])
  }
  return data_arr
}
function get_dice_data(hall, floor, rate, mode) {
  if (hall == "da") {
    hall = "100100002"
    floor_id = '1003000' + floor
    m_id = 100500000
  }

  if (hall == "ni") {
    hall = "100100003"
    floor_id = '1003300' + floor
    m_id = 100530000
  }
  data_arr = {}
  for (var i = 1; i <= 40; i++) {
    if (floor == 1) {
      daiban = i
    } else {
      daiban = (Number(floor) - 1) * 40 + i
    }
    machine_id = String(m_id + daiban)

    var data = {
      "mst_hall_id": hall,
      "mst_floor_id": floor_id,
      "mst_machine_id": machine_id
    }
    var options = {
      "method": "post",
      "payload": JSON.stringify(data),
      "headers": headers
    }
    var res = UrlFetchApp.fetch(url, options);
    var res_json = JSON.parse(res.getContentText())
    bonus_at_data = res_json['body']['slot_detail'][mode]['bonus_history']
    total_spin = res_json['body']['slot_detail'][mode]['total_spin_count']
    bonus_count = bonus_at_data.length
    bb_count = 0
    rb_count = 0
    bb_hit_ave = 0
    rb_hit_ave = 0
    total_ave = 0
    hist_log = ""
    if (bonus_count != 0) {
      for (var log = 0; log < bonus_count; log++) {
        if (bonus_at_data[log]["type"] == 1) {
          hist_log += String(bonus_at_data[log]["spin"]) + "UJP,"
        } else {
          hist_log += String(bonus_at_data[log]["spin"]) + "JP,"
        }
      }
    }
    red_count = 0
    for (var j = 0; j < bonus_count; j++) {
      bonus_type = Number(res_json['body']['slot_detail'][mode]['bonus_history'][j]['type'])
      if (bonus_type == 1) {
        bb_count += 1
      }
      else if(bonus_type == 2){
        rb_count += 1
        red_count += 1
      }else{
        rb_count +=1
      }
      console.log(i)
      console.log (bonus_type)

    }
    if (bonus_count != 0) {
      if (bb_count != 0) {
        bb_hit_ave = total_spin / bb_count
      }
      if (rb_count != 0) {
        rb_hit_ave = total_spin / rb_count
      }
    }
    today_medal = res_json['body']['slot_detail'][mode]['medal']
    var today = new Date();
    /*�擾�������t�𐼗���ŕ\������formatdate�ɑ��*/
    var formatDate = Utilities.formatDate(today, "JST", "yyyy�NM��d��");
    var time_now = Utilities.formatDate(today, "JST", "HH:mm");
    if (bonus_count != 0) {
      total_ave = total_spin / bonus_count
    }
    data_arr[i] = [formatDate,
      time_now,
      floor,
      "�_�C�X" + rate,
      i,
      total_spin,
      "",
      "",
      "",
      "",
      today_medal,
      hist_log,
      "",
      "",
      "",
      "",
      "",
      "",
      ""]
    //console.log(data_arr[i])
  }
  return data_arr
}
function get_cosmo_data(hall, floor, rate, mode) {
  if (hall == "da") {
    hall = "100100002"
    floor_id = '1003000' + floor
    m_id = 100500000
  }

  if (hall == "ni") {
    hall = "100100003"
    floor_id = '1003300' + floor
    m_id = 100530000
  }
  data_arr = {}
  for (var i = 1; i <= 40; i++) {
    if (floor == 1) {
      daiban = i
    } else {
      daiban = (Number(floor) - 1) * 40 + i
    }
    machine_id = String(m_id + daiban)

    var data = {
      "mst_hall_id": hall,
      "mst_floor_id": floor_id,
      "mst_machine_id": machine_id
    }
    var options = {
      "method": "post",
      "payload": JSON.stringify(data),
      "headers": headers
    }
    var res = UrlFetchApp.fetch(purl, options);
    var res_json = JSON.parse(res.getContentText())
    console.log(res.getContentText())
    bonus_data = res_json['body']['pachinko_detail'][mode]['bonus_history']
    total_spin = res_json['body']['pachinko_detail'][mode]['total_spin_count']
    bonus_count = bonus_data.length
    hist_log = ""
    if (bonus_count != 0) {
      for (var log = 0; log < bonus_count; log++) {
        if (bonus_data[log]["continue"] == 1) {
          hist_log += String(bonus_data[log]["spin"]) + "��,"
        } else {
          hist_log += String(bonus_data[log]["spin"]) + "�m" + String(bonus_data[log]["continue"]) + "�A,"
        }
      }
    }
    total_bonus_count = 0
    hit_only_count = 0
    seccond_hit_count = 0
    for (var m = 0; m < bonus_count; m++) {
      ren = Number(bonus_data[m]["continue"])
      total_bonus_count += ren
      if (ren == 1) {
        hit_only_count += 1
      }
      if (ren == 2) {
        seccond_hit_count += 1
      }
    }
    total_hit_ave = 0
    first_hit_ave = 0
    only_ratio = 0
    second_ratio = 0
    if (total_bonus_count != 0) {
      total_hit_ave = total_spin / total_bonus_count
      first_hit_ave = total_spin / bonus_count
      if (hit_only_count != 0) {
        only_ratio = hit_only_count / bonus_count
      }
      if (seccond_hit_count != 0) {
        second_ratio = seccond_hit_count / bonus_count
      }
    }

    today_ball = res_json['body']['pachinko_detail'][mode]['ball']
    var today = new Date();
    /*�擾�������t�𐼗���ŕ\������formatdate�ɑ��*/
    var formatDate = Utilities.formatDate(today, "JST", "yyyy�NM��d��");
    var time_now = Utilities.formatDate(today, "JST", "HH:mm");
    data_arr[i] = [formatDate,
      time_now,
      floor,
      "�R�X��" + rate,
      i,
      total_spin,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      today_ball,
      hist_log,
      "",
      "",
      ""]
  } return data_arr
}
function get_mate_data(hall, floor, rate, mode) {
  if (hall == "da") {
    hall = "100100002"
    floor_id = '1003000' + floor
    m_id = 100500000
  }

  if (hall == "ni") {
    hall = "100100003"
    floor_id = '1003300' + floor
    m_id = 100530000
  }
  data_arr = {}
  for (var i = 1; i <= 40; i++) {
    if (floor == 1) {
      daiban = i
    } else {
      daiban = (Number(floor) - 1) * 40 + i
    }
    machine_id = String(m_id + daiban)

    var data = {
      "mst_hall_id": hall,
      "mst_floor_id": floor_id,
      "mst_machine_id": machine_id
    }
    var options = {
      "method": "post",
      "payload": JSON.stringify(data),
      "headers": headers
    }
    var res = UrlFetchApp.fetch(purl, options);
    var res_json = JSON.parse(res.getContentText())
    bonus_data = res_json['body']['pachinko_detail'][mode]['bonus_history']
    total_spin = res_json['body']['pachinko_detail'][mode]['total_spin_count']
    bonus_count = bonus_data.length
    hist_log = ""
    if (bonus_count != 0) {
      for (var log = 0; log < bonus_count; log++) {
        if (bonus_data[log]["continue"] == 1) {
          hist_log += String(bonus_data[log]["spin"]) + "��,"
        } else {
          hist_log += String(bonus_data[log]["spin"]) + "�m" + String(bonus_data[log]["continue"]) + "�A,"
        }
      }
    }
    total_bonus_count = 0
    hit_only_count = 0
    seccond_hit_count = 0
    for (var m = 0; m < bonus_count; m++) {
      ren = Number(bonus_data[m]["continue"])
      total_bonus_count += ren
      if (ren == 1) {
        hit_only_count += 1
      }
      if (ren == 2) {
        seccond_hit_count += 1
      }
    }
    total_hit_ave = 0
    first_hit_ave = 0
    only_ratio = 0
    second_ratio = 0
    if (total_bonus_count != 0) {
      total_hit_ave = total_spin / total_bonus_count
      first_hit_ave = total_spin / bonus_count
      if (hit_only_count != 0) {
        only_ratio = hit_only_count / bonus_count
      }
      if (seccond_hit_count != 0) {
        second_ratio = seccond_hit_count / bonus_count
      }
    }

    today_ball = res_json['body']['pachinko_detail'][mode]['ball']
    var today = new Date();
    /*�擾�������t�𐼗���ŕ\������formatdate�ɑ��*/
    var formatDate = Utilities.formatDate(today, "JST", "yyyy�NM��d��");
    var time_now = Utilities.formatDate(today, "JST", "HH:mm");
    data_arr[i] = [formatDate,
      time_now,
      floor,
      "���C�g" + rate,
      i,
      total_spin,
      "",
      "",
      "",
      "",
      today_ball,
      hist_log,
      "",
      "",
      "",
      "",
      "",
      "",
      ""]
  } return data_arr
}
function CreateNewSpreadSheet(file_name, folder_id) {

  //�y�菇1�z�V�K�X�v���b�h�V�[�g���}�C�h���C�u�ɍ쐬����
  const ss = SpreadsheetApp.create(file_name);

  /*addFile,removeFile���\�b�h�̃p�����[�^��File�I�u�W�F�N�g���w�肷�邽�߁A
  �y�菇1�z�ō쐬�����X�v���b�h�V�[�g��File�I�u�W�F�N�g�Ƃ��Ď擾���� */
  const file = DriveApp.getFileById(ss.getId());

  //�y�菇2�z�菇1�ō쐬�����X�v���b�h�V�[�g���w��t�H���_�Ɂu�ǉ��v����
  const id = folder_id; //�t�H���_ID
  DriveApp.getFolderById(id).addFile(file);

  //�y�菇3�z�菇1�ō쐬�����X�v���b�h�V�[�g���}�C�h���C�u����u�폜�v����
  DriveApp.getRootFolder().removeFile(file);
  return ss.getId()
}
function write_s_rose_data(hall, floor, rate, mode, sheet) {
  data = get_s_rose_data(hall, floor, rate, mode)
  var total_spin_sum = 0
  var total_bb_sum = 0
  var total_rb_sum = 0
  var total_first_hit_sum = 0
  var total_ren_ave_sum = 0
  var not_zero_m_num = 40
  var total_go_to_mode_b = 0
  var total_go_to_mode_b_ratio = 0
  var total_base_game = 0

  str = ["�V�N��" + rate,"","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  datail = ["���t", "����", "�t���A", "�@�햼", "���", "����]", "BB��", "BB�m��", "RB��", "RB�m��", "���Z", "���������", "��������m��", "�AG����","�A�˓���","�A�˓���","�R�C������", "����", "����"]
  data_for_write.push(datail)
  m_total_medal = 0
  for (var l = 0; l < 40; l++) {
    data_for_write.push(data[l + 1])
    m_total_medal += Number(data[l + 1][17])
    total_spin_sum += Number(data[l + 1][5])
    total_bb_sum += Number(data[l + 1][6])
    total_rb_sum += Number(data[l + 1][8])
    total_first_hit_sum += Number(data[l + 1][11])
    total_ren_ave_sum += Number(data[l + 1][13])
    total_go_to_mode_b += Number(data[l + 1][14])
    if (Number(data[l + 1][13]) == 0) {
      not_zero_m_num -= 1
    }
  }
  if (total_first_hit_sum != 0){
    total_go_to_mode_b_ratio = total_go_to_mode_b/total_first_hit_sum
  }
  total_bb_ave = 0
  if (total_bb_sum != 0) {
    total_bb_ave = total_spin_sum / total_bb_sum
  }
  total_rb_ave = 0
  if (total_rb_sum != 0) {
    total_rb_ave = total_spin_sum / total_rb_sum
  }
  total_b_ave = 0
  if ((total_bb_sum + total_rb_sum) != 0) {
    total_b_ave = total_spin_sum / (total_bb_sum + total_rb_sum)
  }
  total_ren_ave = 0
  if (total_ren_ave_sum != 0) {
    total_ren_ave = total_ren_ave_sum / not_zero_m_num
  }
  total_out_medal = total_bb_sum * 307 + total_rb_sum * 126
  var total_spend_medal = total_out_medal - Number(m_total_medal)
  var total_game_per_medal = 0
  if (total_spin_sum != 0){
    total_game_per_medal = total_spend_medal/total_spin_sum
  }
  if (total_game_per_medal != 0){
    total_base_game = 50/total_game_per_medal
  }  
  str = ["�g�[�^��", "", "", "", "", total_spin_sum, total_bb_sum, total_bb_ave, total_rb_sum, total_rb_ave, total_b_ave, total_first_hit_sum, total_ren_ave_sum, total_ren_ave, total_go_to_mode_b,total_go_to_mode_b_ratio,total_base_game,m_total_medal,""]
  console.log(str)
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
}
function write_w_rose_data(hall, floor, rate, mode, sheet) {
  data = get_w_rose_data(hall, floor, rate, mode)
  var total_spin_sum = 0
  var total_bb_sum = 0
  var total_rb_sum = 0
  var total_direct_bb_sum = 0
  var total_direct_bb_ave_sum = 0
  var not_zero_m_num = 40
  str = ["�E�B�b�`" + rate,"","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  datail = ["���t", "����", "�t���A", "�@�햼", "���", "����]", "BB��", "BB�m��", "RB��", "RB�m��", "���Z", "BB���������", "BB��������m��", "����", "����","","","",""]
  data_for_write.push(datail)
  m_total_medal = 0
  for (var l = 0; l < 40; l++) {
    data_for_write.push(data[l + 1])
    m_total_medal += Number(data[l + 1][13])
    total_spin_sum += Number(data[l + 1][5])
    total_bb_sum += Number(data[l + 1][6])
    total_rb_sum += Number(data[l + 1][8])
    total_direct_bb_sum += Number(data[l + 1][11])
    total_direct_bb_ave_sum += Number(data[l + 1][12])
    if (Number(data[l + 1][12]) == 0) {
      not_zero_m_num -= 1
    }
  }
  total_bb_ave = 0
  if (total_bb_sum != 0) {
    total_bb_ave = total_spin_sum / total_bb_sum
  }
  total_rb_ave = 0
  if (total_rb_sum != 0) {
    total_rb_ave = total_spin_sum / total_rb_sum
  }
  total_b_ave = 0
  if ((total_bb_sum + total_rb_sum) != 0) {
    total_b_ave = total_spin_sum / (total_bb_sum + total_rb_sum)
  }
  total_direct_bb_ave = 0
  if (total_direct_bb_ave_sum != 0) {
    total_direct_bb_ave = total_direct_bb_ave_sum / not_zero_m_num
  }
  str = ["�g�[�^��", "", "", "", "", total_spin_sum, total_bb_sum, total_bb_ave, total_rb_sum, total_rb_ave, total_b_ave, total_direct_bb_sum, total_direct_bb_ave, m_total_medal,"","","","",""
  ]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
}
function write_rich_data(hall, floor, rate, mode, sheet) {
  data = get_rich_data(hall, floor, rate, mode)
  var total_spin_sum = 0
  var total_bb_sum = 0
  var total_rb_sum = 0
  str = ["���b�`" + rate,"","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  datail = ["���t", "����", "�t���A", "�@�햼", "���", "����]", "BB��", "BB�m��", "RB��", "RB�m��", "���Z", "����", "����","","","","","",""]
  data_for_write.push(datail)
  m_total_medal = 0
  for (var l = 0; l < 40; l++) {
    data_for_write.push(data[l + 1])
    m_total_medal += Number(data[l + 1][11])
    total_spin_sum += Number(data[l + 1][5])
    total_bb_sum += Number(data[l + 1][6])
    total_rb_sum += Number(data[l + 1][8])
  }
  total_bb_ave = 0
  if (total_bb_sum != 0) {
    total_bb_ave = total_spin_sum / total_bb_sum
  }
  total_rb_ave = 0
  if (total_rb_sum != 0) {
    total_rb_ave = total_spin_sum / total_rb_sum
  }
  total_b_ave = 0
  if ((total_bb_sum + total_rb_sum) != 0) {
    total_b_ave = total_spin_sum / (total_bb_sum + total_rb_sum)
  }
  str = ["�g�[�^��", "", "", "", "", total_spin_sum, total_bb_sum, total_bb_ave, total_rb_sum, total_rb_ave, total_b_ave, m_total_medal,"","","","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
}
function write_peach_data(hall, floor, rate, mode, sheet) {
  data = get_peach_data(hall, floor, rate, mode)
  var total_spin_sum = 0
  var total_bb_sum = 0
  var total_rb_sum = 0
  var total_at_sum = 0
  str = ["�s�[�`" + rate,"","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  datail = ["���t", "����", "�t���A", "�@�햼", "���", "����]", "BB��", "BB�m��", "RB��", "RB�m��", "AT��", "AT�m��", "���Z", "����", "����","","","",""]
  data_for_write.push(datail)
  m_total_medal = 0
  for (var l = 0; l < 40; l++) {
    data_for_write.push(data[l + 1])
    m_total_medal += Number(data[l + 1][13])
    total_spin_sum += Number(data[l + 1][5])
    total_bb_sum += Number(data[l + 1][6])
    total_rb_sum += Number(data[l + 1][8])
    total_at_sum += Number(data[l + 1][10])
  }
  total_bb_ave = 0
  if (total_bb_sum != 0) {
    total_bb_ave = total_spin_sum / total_bb_sum
  }
  total_rb_ave = 0
  if (total_rb_sum != 0) {
    total_rb_ave = total_spin_sum / total_rb_sum
  }
  total_at_ave = 0
  if (total_at_sum != 0) {
    total_at_ave = total_spin_sum / total_at_sum
  }
  total_b_ave = 0
  if ((total_bb_sum + total_rb_sum) != 0) {
    total_b_ave = total_spin_sum / (total_bb_sum + total_rb_sum)
  }
  str = ["�g�[�^��", "", "", "", "", total_spin_sum, total_bb_sum, total_bb_ave, total_rb_sum, total_rb_ave, total_at_sum, total_at_ave, total_b_ave, m_total_medal,"","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
}
function write_dice_data(hall, floor, rate, mode, sheet) {
  data = get_dice_data(hall, floor, rate, mode)
  var total_spin_sum = 0
  var total_bb_sum = 0
  var total_rb_sum = 0
  str = ["�_�C�X" + rate,"","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  datail = ["���t", "����", "�t���A", "�@�햼", "���", "����]", "JP��", "JP�m��", "UJP��", "UJP�m��", "����", "����","","","","","","",""]
  data_for_write.push(datail)
  m_total_medal = 0
  for (var l = 0; l < 40; l++) {
    data_for_write.push(data[l + 1])
    m_total_medal += Number(data[l + 1][10])
    total_spin_sum += Number(data[l + 1][5])
    total_bb_sum += Number(data[l + 1][6])
    total_rb_sum += Number(data[l + 1][8])
  }
  total_bb_ave = 0
  if (total_bb_sum != 0) {
    total_bb_ave = total_spin_sum / total_bb_sum
  }
  total_rb_ave = 0
  if (total_rb_sum != 0) {
    total_rb_ave = total_spin_sum / total_rb_sum
  }
  str = ["�g�[�^��", "", "", "", "", total_spin_sum, total_bb_sum, total_bb_ave, total_rb_sum, total_rb_ave, m_total_medal,"","","","","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
}
function write_cosmo_data(hall, floor, rate, mode, sheet) {
  data = get_cosmo_data(hall, floor, rate, mode)
  var total_spin_sum = 0
  var total_bb_sum = 0
  var total_first_hit_sum = 0
  var hit_only_count_sum = 0
  var hit_second_count_sum = 0

  str = ["�R�X��" + rate,"","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  datail = ["���t", "����", "�t���A", "�@�햼", "���", "����]", "��B��", "��B�m��", "���������", "��������m��", "�P����", "�P����", "2�A��", "2�A��", "����", "����","","",""]
  data_for_write.push(datail)
  m_total_medal = 0
  for (var l = 0; l < 40; l++) {
    data_for_write.push(data[l + 1])
    m_total_medal += Number(data[l + 1][14])
    total_spin_sum += Number(data[l + 1][5])
    total_bb_sum += Number(data[l + 1][6])
    total_first_hit_sum += Number(data[l + 1][8])
    hit_only_count_sum += Number(data[l + 1][10])
    hit_second_count_sum += Number(data[l + 1][12])
  }

  total_bb_ave = 0
  if (total_bb_sum != 0) {
    total_bb_ave = total_spin_sum / total_bb_sum
  }
  total_f_hit_ave = 0
  if (total_first_hit_sum != 0) {
    total_f_hit_ave = total_spin_sum / total_first_hit_sum
  }
  total_hit_only_count_ave = 0
  if (hit_only_count_sum != 0) {
    total_hit_only_count_ave = hit_only_count_sum / total_first_hit_sum
  }
  total_hit_second_count_ave = 0
  if (hit_second_count_sum != 0) {
    total_hit_second_count_ave = hit_second_count_sum / total_first_hit_sum
  }
  str = ["�g�[�^��", "", "", "", "", total_spin_sum, total_bb_sum, total_bb_ave, total_first_hit_sum, total_f_hit_ave, hit_only_count_sum, total_hit_only_count_ave, hit_second_count_sum, total_hit_second_count_ave, m_total_medal,"","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
}
function write_mate_data(hall, floor, rate, mode, sheet) {
  data = get_mate_data(hall, floor, rate, mode)
  var total_spin_sum = 0
  var total_bb_sum = 0
  var total_first_hit_sum = 0
  str = ["���C�g" + rate,"","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  datail = ["���t", "����", "�t���A", "�@�햼", "���", "����]", "��B��", "��B�m��", "���������", "��������m��", "����", "����","","","","","","",""]
  data_for_write.push(datail)
  m_total_medal = 0
  for (var l = 0; l < 40; l++) {
    data_for_write.push(data[l + 1])
    m_total_medal += Number(data[l + 1][10])
    total_spin_sum += Number(data[l + 1][5])
    total_bb_sum += Number(data[l + 1][6])
    total_first_hit_sum += Number(data[l + 1][6])
  }
  total_bb_ave = 0
  if (total_bb_sum != 0) {
    total_bb_ave = total_spin_sum / total_bb_sum
  }
  total_f_hit_ave = 0
  if (total_first_hit_sum != 0) {
    total_f_hit_ave = total_spin_sum / total_first_hit_sum
  }
  str = ["�g�[�^��", "", "", "", "", total_spin_sum, total_bb_sum, total_bb_ave, total_first_hit_sum, total_f_hit_ave, m_total_medal,"","","","","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
  str = ["�]��","","","","","","","","","","","","","","","","","",""]
  data_for_write.push(str)
}


function write_day_data_to_sheet(hall, fileId) {
  let file = DriveApp.getFileById(fileId); //�t�@�C��ID�Ńt�@�C�����擾���Ă݂�
  var sheet = SpreadsheetApp.open(file).getActiveSheet();
  var range = sheet.getRange("E1:Z1000");
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0)
    .setFontColor("#FF0000")
    .setRanges([range])
    .build();
  var rules = sheet.getConditionalFormatRules();
  write_cosmo_data(hall, "01", "0.1", 0, sheet)
  write_w_rose_data(hall, "02", "0.05", 0, sheet)
  write_rich_data(hall, "03", "0.05", 0, sheet)
  write_s_rose_data(hall, "04", "0.05", 0, sheet)
  write_cosmo_data(hall, "05", "0.04", 0, sheet)
  write_mate_data(hall, "06", "0.04", 0, sheet)
  write_rich_data(hall, "07", "0.8", 0, sheet)
  write_peach_data(hall, "08", "0.2", 0, sheet)
  write_s_rose_data(hall, "09", "0.2", 0, sheet)
  write_rich_data(hall, "10", "0.2", 0, sheet)
  write_w_rose_data(hall, "11", "0.2", 0, sheet)
  write_s_rose_data(hall, "12", "0.2", 0, sheet)
  write_dice_data(hall, "13", "0.2", 0, sheet)
  write_s_rose_data(hall, "14", "0.4", 0, sheet)
  write_s_rose_data(hall, "15", "0.8", 0, sheet)
  sheet.clear()
  sheet.getRange("A1:Z1000").applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREEN, false, false);

  sheet.getRange("E1:Z1000").setNumberFormat('#,##0;[Red]-#,##0');
  for (var l = 0; l < data_for_write.length; l++) {
    sheet.appendRow(data_for_write[l])
  }
  sheet.getRange("L3:L43").setNumberFormat("0.0%")
  sheet.getRange("L183:L223").setNumberFormat("0.0%")
  sheet.getRange("N3:N43").setNumberFormat("0.0%")
  sheet.getRange("N183:N223").setNumberFormat("0.0%")
  sheet.getRange("P138:P673").setNumberFormat("0.0%") 
  replace_zero_to_nil(sheet)
}

function write_night_data_to_sheet(hall, fileId, mode) {
  let file = DriveApp.getFileById(fileId); //�t�@�C��ID�Ńt�@�C�����擾���Ă݂�
  var sheet = SpreadsheetApp.open(file).getActiveSheet();
  var range = sheet.getRange("E1:Z1000");
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0)
    .setFontColor("#FF0000")
    .setRanges([range])
    .build();
  var rules = sheet.getConditionalFormatRules();
  write_s_rose_data(hall, "01", "0.05", mode, sheet)
  write_s_rose_data(hall, "02", "0.05", mode, sheet)
  write_w_rose_data(hall, "03", "0.05", mode, sheet)
  write_rich_data(hall, "04", "0.05", mode, sheet)
  write_cosmo_data(hall, "05", "0.04", mode, sheet)
  write_mate_data(hall, "06", "0.04", mode, sheet)
  write_peach_data(hall, "07", "0.2", mode, sheet)
  write_dice_data(hall, "08", "0.2", mode, sheet)
  write_rich_data(hall, "09", "0.2", mode, sheet)
  write_s_rose_data(hall, "10", "0.2", mode, sheet)
  write_s_rose_data(hall, "11", "0.2", mode, sheet)
  write_w_rose_data(hall, "12", "0.2", mode, sheet)
  write_w_rose_data(hall, "13", "0.2", mode, sheet)
  write_w_rose_data(hall, "14", "0.4", mode, sheet)
  write_rich_data(hall, "15", "0.4", mode, sheet)
  sheet.clear()
  sheet.getRange("A1:Z1000").applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREEN, false, false);

  sheet.getRange("E1:Z1000").setNumberFormat('#,##0;[Red]-#,##0');
  sheet.getRange(1, 1, data_for_write.length, data_for_write[0].length).setValues(data_for_write);
  sheet.getRange("L183:L223").setNumberFormat("0.0%")
  sheet.getRange("N183:N223").setNumberFormat("0.0%")  
  replace_zero_to_nil(sheet)
}

function get_day_data() {
  var today = new Date();
  /*�擾�������t�𐼗���ŕ\������formatdate�ɑ��*/
  var formatDate = Utilities.formatDate(today, "JST", "yyyy/M/d");
  day_data_list = get_datasheat_id("1cNDIpqw1CR3d8rcucObIBYRCYttyncLq")
  day_data_id = ""
  for (var p = 0; p < day_data_list.length; p++) {
    if (day_data_list[p][0] == formatDate) {
      day_data_id = day_data_list[p][1]
    }
  }
  if (day_data_id == ""){
    day_data_id = CreateNewSpreadSheet(formatDate, "1cNDIpqw1CR3d8rcucObIBYRCYttyncLq")
  }
  write_day_data_to_sheet("da", day_data_id)
}

function get_night_data() {
  night_data_list = get_datasheat_id("1gR7AxBakfccRZJoo251PxWule7j8ig_8")
  night_data_id = ""
  for (var p = 0; p < night_data_list.length; p++) {
    if (night_data_list[p][0] == "��h�������p") {
      night_data_id = night_data_list[p][1]
    }
  }
  write_night_data_to_sheet("ni", night_data_id,0)
}
function get_yesterday_night_data(){
  var today = new Date();
  var day = today.getDate()
  today.setDate(day - 1)
  /*�擾�������t�𐼗���ŕ\������formatdate�ɑ��*/
  var formatDate = Utilities.formatDate(today, "JST", "yyyy/M/d");
  night_data_list = get_datasheat_id("1gR7AxBakfccRZJoo251PxWule7j8ig_8")
  last_night_data_id = ""
  for (var p = 0; p < night_data_list.length; p++) {
    if (night_data_list[p][0] == formatDate) {
      last_night_data_id = night_data_list[p][1]
    }
  }
  if (last_night_data_id == ""){
    last_night_data_id = CreateNewSpreadSheet(formatDate, "1gR7AxBakfccRZJoo251PxWule7j8ig_8")
  }
  write_night_data_to_sheet("ni", last_night_data_id,1)

  
}
function replace_zero_to_nil(sheet){
  var textFinder2 = sheet.createTextFinder("�]��");
  textFinder2.replaceAllWith("");
}