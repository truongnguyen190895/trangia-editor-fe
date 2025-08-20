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
    let chunks = [];
    
    // First, collect all chunks
    let tempNum = num;
    while (tempNum > 0) {
        let chunk = tempNum % 1000;
        chunks.unshift(chunk);
        tempNum = Math.floor(tempNum / 1000);
    }
    
    // Process chunks with proper handling of zeros
    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i];
        let scaleIndex = chunks.length - 1 - i;
        
        if (chunk !== 0) {
            // Include "không trăm" if this chunk is not the leftmost chunk (i > 0)
            let shouldForceZeroHundreds = i > 0;
            let chunkWords = convertThreeDigits(chunk, shouldForceZeroHundreds);
            
            if (scaleIndex > 0) {
                chunkWords += ' ' + scales[scaleIndex];
            }
            
            words.push(chunkWords);
        }
    }
    
    let result = words.join(' ');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function convertThreeDigits(num: number, forceIncludeZeroHundreds: boolean = false) {
    const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 
                 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
    
    let words = [];
    let hundred = Math.floor(num / 100);
    let remainder = num % 100;
    
    if (hundred > 0) {
        words.push(units[hundred] + ' trăm');
    } else if (forceIncludeZeroHundreds && num > 0) {
        // Add "không trăm" when we're forced to include it for proper representation
        words.push('không trăm');
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