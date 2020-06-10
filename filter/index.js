
/**
 * 转换11位电话号码，给中间加上空格
 */
export function formatTel (tel=''){
	tel = String(tel);
	if(tel.length!=11){
		return tel
	}else{
		const start = tel.substring(0,3)
		const inter = tel.substring(3,7)
		const end = tel.substring(7,11)
		return start+' '+inter+' '+end
	}
}