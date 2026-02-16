export const EnlargeWidgetSize = (baseSize  : number) : number => { // This is for Height only
    var screenHeight = window.screen.height;
    var increasePercent = baseSize / 832;   // 864px is Last responsive breakpoint for height in application.
    // return (screenHeight * increasePercent);
    return (baseSize)
};

export const EnlargeWidgetSizeWidth = (baseWidth : number) : number => {
    var screenWidth = window.screen.width;
    var increasePercent = baseWidth / 1280;  // 1536px is Last responsive breakpoint fior Width in application.
    return (screenWidth * increasePercent);
};

export const EnlargeWidgetContent = (baseHeightOfWidget : number, baseHeightofContent : number) : number => {
    var widgetHeight = EnlargeWidgetSize(baseHeightOfWidget);
    var WidgetContentPercentToEnlarge = baseHeightofContent / baseHeightOfWidget;
    // return (widgetHeight * WidgetContentPercentToEnlarge);
    return baseHeightOfWidget
}; 

export const EnlargeWidgetContentWidth = (baseWidth : number, baseWidthofContent? : number) : number => { // Note : Date 12-12-24 => This function has some Error.
    var widgetWidth = EnlargeWidgetContentWidth(baseWidth);
    if(!baseWidthofContent) {
        return widgetWidth;
    } else {
        var WidgetContentWidthPercentToEnlarge = baseWidthofContent / baseWidth;
        // return (widgetWidth * WidgetContentWidthPercentToEnlarge);
        return baseWidthofContent
    }
};

export function CalculateResponsiveValue(originalValue : number) {
    // Base Resolution
    const originalWidth = 1280;
    const originalHeight = 832;

    // Get the current screen resolution
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
  
    // Calculate scale factors based on width and height
    const scaleFactorWidth = currentWidth / originalWidth;
    const scaleFactorHeight = currentHeight / originalHeight;
  
    // You can choose either width-based or height-based scaling, or average
    const scaleFactor = Math.max(scaleFactorWidth, scaleFactorHeight); // Using max for aspect ratio consistency
  
    // Calculate the adjusted value
    const adjustedValue = originalValue * scaleFactor;
  
    return originalValue;
  }


  export const EnlargeHeight = (baseSize  : number) : number => { // This is for Height only
    var screenHeight = window.screen.height;
    var increasePercent = baseSize / 832;   // 864px is Last responsive breakpoint for height in application.
    return (screenHeight * increasePercent);
};

export const EnlargeWidth = (baseSize  : number) : number => { // This is for Height only
    var screenWidth = window.screen.width;
    var increasePercent = baseSize / 1280;   // 864px is Last responsive breakpoint for height in application.
    return (screenWidth * increasePercent);
};