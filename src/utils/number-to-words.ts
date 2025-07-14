export function numberToVietnamese(num: string): string {

    const processedNum = parseFloat(num);
    if (processedNum === 0) return 'Không';
    if (processedNum < 0) throw new Error('Number is negative');
    
    // Check if the number has decimal part (including .0)
    if (num.toString().includes('.')) {
        const parts = num.toString().split('.');
        const integerPart = parseInt(parts[0]);
        const decimalPart = parts[1];
        
        let integerWords = numberToVietnamese(integerPart.toString());
        let decimalWords = convertDecimalPart(decimalPart);
        
        // Always include "phẩy" even if decimal part is 0
        return integerWords.charAt(0).toUpperCase() + 
               integerWords.slice(1) + ' phẩy ' + decimalWords;
    }
    
    return convertInteger(processedNum);
}

function convertInteger(num: number) {
    const scales = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];
    
    let words = [];
    let scaleIndex = 0;
    
    while (num > 0) {
        let chunk = num % 1000;
        num = Math.floor(num / 1000);
        
        if (chunk !== 0) {
            let chunkWords = convertThreeDigits(chunk);
            
            if (scaleIndex > 0) {
                chunkWords += ' ' + scales[scaleIndex];
            }
            
            words.unshift(chunkWords);
        }
        
        scaleIndex++;
    }
    
    let result = words.join(' ');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function convertThreeDigits(num: number) {
    const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 
                 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
    
    let words = [];
    let hundred = Math.floor(num / 100);
    let remainder = num % 100;
    
    if (hundred > 0) {
        words.push(units[hundred] + ' trăm');
    }
    
    if (remainder > 0) {
        let ten = Math.floor(remainder / 10);
        let unit = remainder % 10;
        
        if (ten > 0) {
            words.push(tens[ten]);
        }
        
        if (unit > 0) {
            if (ten === 0 && hundred !== 0) {
                words.push('lẻ');
            }
            if (unit === 1 && ten >= 2) {
                words.push('mốt');
            } else if (unit === 4 && ten >= 2) {
                words.push('tư');
            } else if (unit === 5 && ten >= 1) {
                words.push('lăm');
            } else {
                words.push(units[unit]);
            }
        }
    }
    
    return words.join(' ');
}

function convertDecimalPart(decimalStr: string) {
    const units = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    let words = [];
    
    for (let i = 0; i < decimalStr.length; i++) {
        const digit = parseInt(decimalStr[i]);
        words.push(units[digit]);
    }
    
    return words.join(' ');
}

console.log(numberToVietnamese('1.200.000.000'.replace(/\./g, '')));