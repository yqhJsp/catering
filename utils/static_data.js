var API_DOMAIN_URL = "https://spa.sefve.com/catering/mini";
var FILE_DOMAIN_URL = "https://file.sefve.com/";
var SOURCE_DOMAIN_URL = "https://spa.sefve.com/catering/";
var MEMBER_DOMAIN_URL = "https://spa.sefve.com/member/mini";
module.exports = {
    file_domain_url: FILE_DOMAIN_URL,
    api_domain_url: API_DOMAIN_URL,
    config_version: 1.0,

    appid: '',
    secret:'',
    //微信下单
    unifiedorder_url: SOURCE_DOMAIN_URL + 'wxpay/v1/unifiedorder',
    orderquery_url: SOURCE_DOMAIN_URL + 'wxpay/v1/orderquery',
    //用户登录
    login_url: MEMBER_DOMAIN_URL + '/v2/session/login',
    jscode2session_url: MEMBER_DOMAIN_URL + '/v2/session/jscode2session',
    //首页接口地址
    home_data_url: API_DOMAIN_URL + '/v1/home',
    //菜品分类列表
    get_cookclassify_url: API_DOMAIN_URL + '/v1/getcookclassifylist',
    //菜品列表
    get_cooklist_url: API_DOMAIN_URL + '/v1/getcooklist',
    //店内下单
    get_orderbyin_url: API_DOMAIN_URL + '/v1/orderbyin',
    //外卖下单
    get_orderbyout_url: API_DOMAIN_URL + '/v1/orderbyout',
    //获取包厢列表
    get_roomlist_url: API_DOMAIN_URL + '/v1/roomlist',

    //预约包间
    get_reserveroom_url: API_DOMAIN_URL + '/v1/reserveroom',
    
    //优惠买单
    get_discountsorder_url: API_DOMAIN_URL + '/v1/discountsorder ',
    
    //优惠买单列表
    get_discountsorderlist_url: API_DOMAIN_URL + '/v1/discountsorderlist',
     //获取咨询列表
    get_informationlist_url: API_DOMAIN_URL + '/v1/informationlist',
    //获取店内订单列表
    get_getshoporderlist_url: API_DOMAIN_URL + '/v1/getshoporderlist',
    //获取外卖订单列表
    get_getoutorderlist_url: API_DOMAIN_URL + '/v1/getoutorderlist',
    //获取栏目素材详情
    get_columnmaterial_url: API_DOMAIN_URL + '/v1/getcolumnmaterialbyid',
    //获取地址列表
    get_addressList_url: API_DOMAIN_URL + '/v1/address/list',
    //保存地址
    save_address_url: API_DOMAIN_URL + '/v1/address/insert',
    //修改地址
    update_address_url: API_DOMAIN_URL + '/v1/address/update',
    //删除地址
    delete_address_url: API_DOMAIN_URL + '/v1/address/delete'
};