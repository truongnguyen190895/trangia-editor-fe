interface Option {
  value: string;
  label: string;
}

export const CÁC_LOẠI_GIẤY_TỜ_ĐỊNH_DANH: Option[] = [
  {
    value: "CCCD",
    label: "CCCD",
  },
  {
    value: "Hộ chiếu",
    label: "Hộ chiếu",
  },
  {
    value: "CMND",
    label: "CMND",
  },
  {
    value: "Căn cước",
    label: "Căn cước",
  },
];

export const NƠI_CẤP_GIẤY_TỜ_ĐỊNH_DANH: Option[] = [
  {
    value: "Công an Hà Nội",
    label: "Công an Hà Nội",
  },
  {
    value: "Cục cảnh sát quản lý hành chính về trật tự xã hội",
    label: "Cục cảnh sát quản lý hành chính về trật tự xã hội",
  },
  {
    value: "Cục cảnh sát ĐKQL cư trú và DLQG về dân cư",
    label: "Cục cảnh sát ĐKQL cư trú và DLQG về dân cư",
  },
  {
    value: "Cục quản lý xuất nhập cảnh",
    label: "Cục quản lý xuất nhập cảnh",
  },
  {
    value: "Bộ Công an",
    label: "Bộ Công an",
  },
];

export const CÁC_LOẠI_GIẤY_CHỨNG_NHẬN_QUYỀN_SỬ_DỤNG_ĐẤT: Option[] = [
  {
    value:
      "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất",
    label:
      "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất",
  },
  {
    value: "Giấy chứng nhận quyền sử dụng đất",
    label: "Giấy chứng nhận quyền sử dụng đất",
  },
  {
    value:
      "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất",
    label:
      "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất",
  },
  {
    value: "Giấy chứng nhận quyền sở hữu nhà ở và quyền sử dụng đất ở",
    label: "Giấy chứng nhận quyền sở hữu nhà ở và quyền sử dụng đất ở",
  },
  {
    value:
      "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất",
    label:
      "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất",
  },
  {
    value:
      "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất - Sổ mới",
    label:
      "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất - Sổ mới",
  },
];

export const NGUỒN_GỐC_SỬ_DỤNG_ĐẤT: Option[] = [
  {
    value: "Công nhận quyền sử dụng đất như giao đất có thu tiền sử dụng đất",
    label: "Công nhận quyền sử dụng đất như giao đất có thu tiền sử dụng đất",
  },
  {
    value:
      "Công nhận quyền sử dụng đất như giao đất không thu tiền sử dụng đất",
    label:
      "Công nhận quyền sử dụng đất như giao đất không thu tiền sử dụng đất",
  },
  {
    value:
      "Công nhận QSDĐ như giao đất có thu tiền sử dụng đất: m2; Công nhận QSDĐ như giao đất không thu tiền sử dụng đất: m2",
    label:
      "Công nhận QSDĐ như giao đất có thu tiền sử dụng đất: m2; Công nhận QSDĐ như giao đất không thu tiền sử dụng đất: m2",
  },
  {
    value: "Nhận chuyển nhượng quyền sử dụng đất",
    label: "Nhận chuyển nhượng quyền sử dụng đất",
  },
  {
    value:
      "Nhận chuyển nhượng đất được Nhà nước giao đất có thu tiền sử dụng đất",
    label:
      "Nhận chuyển nhượng đất được Nhà nước giao đất có thu tiền sử dụng đất",
  },
  {
    value:
      "Nhận chuyển nhượng đất được Nhà nước giao đất có thu tiền SDĐ: m2 và công nhận QSDĐ như giao đất không thu tiền SDĐ: m2",
    label:
      "Nhận chuyển nhượng đất được Nhà nước giao đất có thu tiền SDĐ: m2 và công nhận QSDĐ như giao đất không thu tiền SDĐ: m2",
  },
  {
    value:
      "Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất có thu tiền sử dụng đất",
    label:
      "Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất có thu tiền sử dụng đất",
  },
  {
    value:
      "Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất không thu tiền sử dụng đất",
    label:
      "Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất không thu tiền sử dụng đất",
  },
  {
    value:
      "Nhận chuyển nhượng đất được Nhà nước giao đất có thu tiền SDĐ: m2; Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất không thu tiền SDĐ: m2",
    label:
      "Nhận chuyển nhượng đất được Nhà nước giao đất có thu tiền SDĐ: m2; Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất không thu tiền SDĐ: m2",
  },
  {
    value:
      "Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất có thu tiền SDĐ: m2; Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất không thu tiền SDĐ: m2",
    label:
      "Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất có thu tiền SDĐ: m2; Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất không thu tiền SDĐ: m2",
  },
  {
    value:
      "Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất có thu tiền SDĐ: m2; Công nhận QSDĐ như giao đất không thu tiền SDĐ: m2",
    label:
      "Nhận chuyển nhượng đất được Công nhận QSDĐ như giao đất có thu tiền SDĐ: m2; Công nhận QSDĐ như giao đất không thu tiền SDĐ: m2",
  },
  {
    value: "Nhà nước công nhận quyền sử dụng đất",
    label: "Nhà nước công nhận quyền sử dụng đất",
  },
  {
    value:
      "Nhà nước công nhận quyền sử dụng đất. Nhận chuyển nhượng đất của ông (bà):",
    label:
      "Nhà nước công nhận quyền sử dụng đất. Nhận chuyển nhượng đất của ông (bà):",
  },
  {
    value:
      "Nhà nước giao đất có thu tiền sử dụng đất: m2. Công nhận QSDĐ như giao đất không thu tiền sử dụng đất: m2",
    label:
      "Nhà nước giao đất có thu tiền sử dụng đất: m2. Công nhận QSDĐ như giao đất không thu tiền sử dụng đất: m2",
  },
  {
    value: "Nhận tặng cho quyền sử dụng đất",
    label: "Nhận tặng cho quyền sử dụng đất",
  },
  {
    value: "Nhận thừa kế được Nhà nước giao đất có thu tiền sử dụng đất",
    label: "Nhận thừa kế được Nhà nước giao đất có thu tiền sử dụng đất",
  },
  {
    value:
      "Nhận thừa kế đất được công nhận quyền sử dụng đất như giao đất có thu tiền sử dụng đất",
    label:
      "Nhận thừa kế đất được công nhận quyền sử dụng đất như giao đất có thu tiền sử dụng đất",
  },
  {
    value:
      "Được tặng cho đất được Công nhận QSDĐ như giao đất có thu tiền SDĐ: m2; Được tặng cho đất được Công nhận QSDĐ như giao đất không thu tiền SDĐ: m2",
    label:
      "Được tặng cho đất được Công nhận QSDĐ như giao đất có thu tiền SDĐ: m2; Được tặng cho đất được Công nhận QSDĐ như giao đất không thu tiền SDĐ: m2",
  },
  {
    value: "Được tặng cho đất được Nhà nước giao đất có thu tiền sử dụng đất",
    label: "Được tặng cho đất được Nhà nước giao đất có thu tiền sử dụng đất",
  },
  {
    value:
      "Nhận chuyển nhượng đất được nhà nước công nhận QSDĐ như giao đất có thu tiền sử dụng đất",
    label:
      "Nhận chuyển nhượng đất được nhà nước công nhận QSDĐ như giao đất có thu tiền sử dụng đất",
  },
  {
    value: "Nhà nước giao đất không thu tiền sử dụng đất",
    label: "Nhà nước giao đất không thu tiền sử dụng đất",
  },
];

export const MỤC_ĐÍCH_SỬ_DỤNG_ĐẤT: Option[] = [
  {
    value: "Đất ở tại đô thị",
    label: "Đất ở tại đô thị",
  },
  {
    value: "Đất ở tại nông thôn", 
    label: "Đất ở tại nông thôn",
  },
  {
    value: "Đất trồng cây công nghiệp lâu năm",
    label: "Đất trồng cây công nghiệp lâu năm",
  },
  {
    value: "Đất trồng cây ăn quả lâu năm",
    label: "Đất trồng cây ăn quả lâu năm", 
  },
  {
    value: "Đất trồng cây lâu năm",
    label: "Đất trồng cây lâu năm",
  },
  {
    value: "Đất trồng cây lâu năm khác",
    label: "Đất trồng cây lâu năm khác",
  },
  {
    value: "Đất trồng cây hàng năm khác",
    label: "Đất trồng cây hàng năm khác",
  },
  {
    value: "Đất ở",
    label: "Đất ở",
  },
  {
    value: "Đất chuyên trồng lúa nước",
    label: "Đất chuyên trồng lúa nước",
  },
  {
    value: "Đất trồng lúa",
    label: "Đất trồng lúa",
  },
  {
    value: "Đất làm muối",
    label: "Đất làm muối",
  },
  {
    value: "Đất rừng sản xuất",
    label: "Đất rừng sản xuất",
  },
  {
    value: "Đất nuôi trồng thủy sản",
    label: "Đất nuôi trồng thủy sản",
  }
];