export const generateThoiHanSuDung = (
  input: {
    phân_loại: string;
    diện_tích: string;
    thời_hạn_sử_dụng: string;
  }[]
) => {
    if (input.length === 0) {
        return '';
    }

    if (input.length === 1 || input[0].diện_tích === null ) {
        return input[0].thời_hạn_sử_dụng
    }

    let result = '';
    input.forEach((item) => {
        result += `${item.phân_loại}: ${item.thời_hạn_sử_dụng}; `;
    });

    return result;
};
