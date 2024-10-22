export enum MasterType {
  Diamond_certificate = 'diamond_certificate_master',
  Diamond_process = 'diamond_process_master',
  Availability = 'availability_master',
  Polish = 'polish_master',
  symmetry = 'symmetry_master',
  fluorescenceIntensity = 'fluorescence_intensity_master',
  fluorescenceColor = 'fluorescence_color_master',
  lab = 'lab_master',
  fancyColor = 'fancy_color_master',
  fancyColorIntensity = 'fancy_color_intensity_master',
  fancyColorOvertone = 'fancy_color_overtone_master',
  GirdleThin = 'girdle_thin_master',
  GirdleThick = 'girdle_thick_master',
  GirdleCondition = 'girdle_condition_master',
  culetCondition = 'culet_condition_master',
  LaserInscription = 'laser_inscription_master',
  certComment = 'cert_comment_master',
  country = 'country',
  state = 'state',
  city = 'city',
  TimeToLocation = 'time_to_location_master',
  pairSeparable = 'pair_separable_master',
  pairStock = 'pair_stock_master',
  parcelStones = 'parcel_stones_master',
  tradeShow = 'trade_show_master',
  shade = 'shade_master',
  centerInclusion = 'center_inclusion_master',
  blackInclusion = 'black_inclusion_master',
  ReportType = 'report_type_master',
  labLocation = 'lab_location_master',
  milky = 'milky_master',
  BGM = 'bgm_master',
  pair = 'pair_master',
  HandA = 'H&A_master',
  growthType = 'growth_type_master'
}

export enum Diamond_type {
  Natural = 1,
  Lab_grown = 2,
  Both = 3
}
export enum Info_Key {
  Metal_tone = 'metal_tone',
  Metal_karat = 'metal_karat',
  Stone_master = 'stone_master',
  Shape_master = 'shape_master',
  Carat = 'carat',
  Color = 'color',
  Clarity = 'clarity',
  Head = 'head',
  Shank = 'shank',
  Setting_type = 'setting_type',
  Side_setting = 'side_setting',
  Brands = 'brands',
  Collection = 'collection'
}

export enum IMAGE_UPLOAD_TYPE {
  Image = '2',
  Featured_images = '1',
  Thirysix_images = '3',
  Video_upload = '4',
  Glb_upload = '5'
}

export enum COUPON_DISCOUNT_TYPE {
  PercentageDiscount = 'percentage_discount',
  FixedAmountDiscount = 'fixed_amount_discount'
}

export enum COUPON_DURATION {
  Once = 'once',
  Forever = 'forever'
}
