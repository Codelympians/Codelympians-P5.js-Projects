// P5 Template with fps Display

// Variables used for fps
var frameTimes = [] // Time recordings corresponding to each frame
let oldTime = 0 // Time at which the previous frame is updated
let fpsCooldown = 0 // When fpsCooldown <= 0, set displayFPS = fps
let displayFPS = 0 // fps displayed on screen, updated every second

var border = 100;
var includeAdvancedCards = true;
var includeKatakana = true;

var currentCard;
var testingTerm = 1;
var showAnswers = false;
var mouseClick = false;
var deck = [];
var completedIndices = [];

var width;
var height;
var xCenter;
var yCenter;
var testCenter;
var tipsCenter;
var answerCenter;
var xUsable;
var yUsable;
var cardWidth;
var cardHeight;
var cardHalfWidth;
var cardHalfHeight;
var cardQuadWidth;
var cardQuadHeight;

function recalibrate() {
    width = windowWidth
    height = windowHeight
    xCenter = width / 2;
    yCenter = height / 2;
    xUsable = width - border;
    yUsable = height - border;

    //if wider use height as boundary
    if (xUsable > yUsable * 4 / 3) {
        cardWidth = yUsable * 4 / 3;
        cardHeight = yUsable;
    } else if (yUsable > xUsable * 3 / 4) {
        cardWidth = xUsable;
        cardHeight = xUsable * 3 / 4;
    }
    cardHalfWidth = cardWidth / 2;
    cardHalfHeight = cardHeight / 2;
    cardQuadWidth = cardWidth / 4;
    cardQuadHeight = cardHeight / 4;
    testCenter = yCenter - cardQuadHeight;
    tipsCenter = yCenter + cardQuadHeight;
    answerCenter = yCenter;
}
class FlashCard {
    constructor(t1, t2, special) {
        if (testingTerm === 1) {
            this.testingTerm = t1;
            this.answerTerm = t2;
        } else if (testingTerm === 2) {
            this.testingTerm = t2;
            this.answerTerm = t1;
        }
        this.special = false;

        if (special)
            this.special = true;
    }
}
function newFlashCard(term1, term2) {
    var nfc = new FlashCard(term1, term2);
    deck.push(nfc);
}

newFlashCard("あ", "a [a̠]");
newFlashCard("い", "i [i]");
newFlashCard("う", "u [ɯ̟ᵝ]");
newFlashCard("え", "e [e̞]");
newFlashCard("お", "o [o̞]");

newFlashCard("か", "ka [ka̠]");
newFlashCard("き", "ki [kʲi]");
newFlashCard("く", "ku [kɯ̟ᵝ]");
newFlashCard("け", "ke [ke̞]");
newFlashCard("こ", "ko [ko̞]");

newFlashCard("さ", "sa [sa̠]");
newFlashCard("し", "shi [ɕi] \n([ɕ] is same as pinyin \"x\")");
newFlashCard("す", "su [sɨᵝ]");
newFlashCard("せ", "se [se̞]");
newFlashCard("そ", "so [so̞]");

newFlashCard("た", "ta [ta̠]");
newFlashCard("ち", "chi [t͡ɕi] \n([t͡ɕ] is same as pinyin \"q\")");
newFlashCard("つ", "tsu [t͡sɨᵝ]");
newFlashCard("て", "te [te̞]");
newFlashCard("と", "to [to̞]");

newFlashCard("な", "na [na̠]");
newFlashCard("に", "ni [ɲ̟i]");
newFlashCard("ぬ", "nu [nɯ̟ᵝ]");
newFlashCard("ね", "ne [ne̞]");
newFlashCard("の", "no [no̞]");

newFlashCard("は", "ha [ha̠] \n(wa [ɰa̠] when used as particle)");
newFlashCard("ひ", "hi [çi]");
newFlashCard("ふ", "fu [ɸɯ̟ᵝ]");
newFlashCard("へ", "he [he̞] \n(e [e̞] when used as particle)");
newFlashCard("ほ", "ho [ho̞]");

newFlashCard("ま", "ma [ma̠]");
newFlashCard("み", "mi [mʲi]");
newFlashCard("む", "mu [mɯ̟ᵝ]");
newFlashCard("め", "me [me̞]");
newFlashCard("も", "mo [mo̞]");

newFlashCard("や", "ya [ja̠]");
newFlashCard("ゆ", "yu [jɯ̟ᵝ]");
newFlashCard("よ", "yo [jo̞]");

newFlashCard("ら", "ra [ɾa̠]");
newFlashCard("り", "ri [ɾʲi]");
newFlashCard("る", "ru [ɾɯ̟ᵝ]");
newFlashCard("れ", "re [ɾe̞]");
newFlashCard("ろ", "ro [ɾo̞]");

newFlashCard("わ", "wa [ɰᵝa̠]");
newFlashCard("を", "wo [o̞]");

newFlashCard("ん", "n [n~ŋ~ɴ~m] \n(mostly used at end of syllables)");

if (includeAdvancedCards) {
    newFlashCard("が", "ga [ga̠~ŋa̠]");
    newFlashCard("ぎ", "gi [gʲi~ŋʲi]");
    newFlashCard("ぐ", "gu [gɯ̟ᵝ~ŋɯ̟ᵝ]");
    newFlashCard("げ", "ge [ge̞~ŋe̞]");
    newFlashCard("ご", "go [go̞~ŋo̞]");

    newFlashCard("ざ", "za [d͡za̠]");
    newFlashCard("じ", "ji [(d)ʑi] \n([d͡ʑ] is same as pinyin \"j\")");
    newFlashCard("ず", "zu [(d)zɯ̟ᵝ]");
    newFlashCard("ぜ", "ze [d͡ze̞]");
    newFlashCard("ぞ", "zo [d͡zo̞]");

    newFlashCard("だ", "da [da̠]");
    newFlashCard("ぢ", "ji (di) [(d)ʑi] \n([d͡ʑ] is same as pinyin \"j\")");
    newFlashCard("づ", "dzu (du) [(d)zɯ̟ᵝ]");
    newFlashCard("で", "de [de̞]");
    newFlashCard("ど", "do [do̞]");

    newFlashCard("ば", "ba [ba̠]");
    newFlashCard("び", "bi [bʲi]");
    newFlashCard("ぶ", "bu [bɯ̟ᵝ]");
    newFlashCard("べ", "be [be̞]");
    newFlashCard("ぼ", "bo [bo̞]");

    newFlashCard("ぱ", "pa [pa̠]");
    newFlashCard("ぴ", "pi [pʲi]");
    newFlashCard("ぷ", "pu [pɯ̟ᵝ]");
    newFlashCard("ぺ", "pe [pe̞]");
    newFlashCard("ぽ", "po [po̞]");
}

if (includeKatakana) {
    newFlashCard("ア", "あ [a̠]");
    newFlashCard("イ", "い [i]");
    newFlashCard("ウ", "う [ɯ̟ᵝ]");
    newFlashCard("エ", "え [e̞]");
    newFlashCard("オ", "お [o̞]");

    newFlashCard("カ", "か [ka̠]");
    newFlashCard("キ", "き [kʲi]");
    newFlashCard("ク", "く [kɯ̟ᵝ]");
    newFlashCard("ケ", "け [ke̞]");
    newFlashCard("コ", "こ [ko̞]");

    newFlashCard("サ", "さ [sa̠]");
    newFlashCard("シ", "し [ɕi] \n([ɕ] is same as pinyin \"x\")");
    newFlashCard("ス", "す [sɨᵝ]");
    newFlashCard("セ", "せ [se̞]");
    newFlashCard("ソ", "そ [so̞]");

    newFlashCard("タ", "た [ta̠]");
    newFlashCard("チ", "ち [t͡ɕi] \n([t͡ɕ] is same as pinyin \"q\")");
    newFlashCard("ツ", "つ [t͡sɨᵝ]");
    newFlashCard("テ", "て [te̞]");
    newFlashCard("ト", "と [to̞]");

    newFlashCard("ナ", "な [na̠]");
    newFlashCard("ニ", "に [ɲ̟i]");
    newFlashCard("ヌ", "ぬ [nɯ̟ᵝ]");
    newFlashCard("ネ", "ね [ne̞]");
    newFlashCard("ノ", "の [no̞]");

    newFlashCard("ハ", "は [ha̠] \n(wa [ɰa̠] when used as particle)");
    newFlashCard("ヒ", "ひ [çi]");
    newFlashCard("フ", "ふ [ɸɯ̟ᵝ]");
    newFlashCard("ヘ", "へ [he̞] \n(e [e̞] when used as particle)");
    newFlashCard("ホ", "ほ [ho̞]");

    newFlashCard("マ", "ま [ma̠]");
    newFlashCard("ミ", "み [mʲi]");
    newFlashCard("ム", "む [mɯ̟ᵝ]");
    newFlashCard("メ", "め [me̞]");
    newFlashCard("モ", "も [mo̞]");

    newFlashCard("ヤ", "や [ja̠]");
    newFlashCard("ユ", "ゆ [jɯ̟ᵝ]");
    newFlashCard("ヨ", "よ [jo̞]");

    newFlashCard("ラ", "ら [ɾa̠]");
    newFlashCard("リ", "り [ɾʲi]");
    newFlashCard("ル", "る [ɾɯ̟ᵝ]");
    newFlashCard("レ", "れ [ɾe̞]");
    newFlashCard("ロ", "ろ [ɾo̞]");

    newFlashCard("ワ", "わ [ɰᵝa̠]");
    newFlashCard("ヲ", "を [o̞]");

    newFlashCard("ン", "ん [n~ŋ~ɴ~m] \n(mostly used at end of syllables)");

    newFlashCard("ガ", "が [ga̠~ŋa̠]");
    newFlashCard("ギ", "ぎ [gʲi~ŋʲi]");
    newFlashCard("グ", "ぐ [gɯ̟ᵝ~ŋɯ̟ᵝ]");
    newFlashCard("ゲ", "げ [ge̞~ŋe̞]");
    newFlashCard("ゴ", "ご [go̞~ŋo̞]");

    newFlashCard("ザ", "ざ [d͡za̠]");
    newFlashCard("ジ", "じ [(d)ʑi] \n([d͡ʑ] is same as pinyin \"j\")");
    newFlashCard("ズ", "ず [(d)zɯ̟ᵝ]");
    newFlashCard("ゼ", "ぜ [d͡ze̞]");
    newFlashCard("ゾ", "ぞ [d͡zo̞]");

    newFlashCard("ダ", "だ [da̠]");
    newFlashCard("ヂ", "ぢ (di) [(d)ʑi] \n([d͡ʑ] is same as pinyin \"j\")");
    newFlashCard("ヅ", "づ [(d)zɯ̟ᵝ]");
    newFlashCard("デ", "で [de̞]");
    newFlashCard("ド", "ど [do̞]");

    newFlashCard("バ", "ば [ba̠]");
    newFlashCard("ビ", "び [bʲi]");
    newFlashCard("ブ", "ぶ [bɯ̟ᵝ]");
    newFlashCard("ベ", "べ [be̞]");
    newFlashCard("ボ", "ぼ [bo̞]");

    newFlashCard("パ", "ぱ [pa̠]");
    newFlashCard("ピ", "ぴ [pʲi]");
    newFlashCard("プ", "ぷ [pɯ̟ᵝ]");
    newFlashCard("ペ", "ぺ [pe̞]");
    newFlashCard("ポ", "ぽ [po̞]");

    newFlashCard("ヴ", "vu (ゔ) [bɯ̟ᵝ]");
}

function cardSelect() {
    if (completedIndices.length === deck.length) {
        congradulateCard()
    } else {
        var cardAlreadyViewed = true
        do {
            var cardNotViewed = true
            var chosenCard = Math.floor(Math.random() * deck.length)
            currentCard = deck[chosenCard]
            for (var cardIndex of completedIndices) {
                if (cardIndex === chosenCard) {
                    cardNotViewed = false
                    break
                }
            }
            if (cardNotViewed) {
                cardAlreadyViewed = false
                completedIndices.push(chosenCard)
            }
        } while (cardAlreadyViewed)
    }
}

function congradulateCard() {
    currentCard = new FlashCard("おめでとう!", "Congratulations! \n(You've completed one entire set.)")
    completedIndices = []
}

function cardMode() {
    if (mouseClick) {
        if (!showAnswers) {
            showAnswers = true;
        } else {
            cardSelect();
            showAnswers = false;
        }
    }
}

function cardPrint() {
    var fontSize = (testingTerm === 1) ? (Math.floor(cardHeight / 6)) : (Math.floor(cardHeight / 12));
    var altFontSize = (testingTerm === 1) ? (Math.floor(cardHeight / 12)) : (Math.floor(cardHeight / 6));
    var tipFontSize = Math.floor(cardHeight / 18);
    //background
    rectMode(CENTER);
    textSize(fontSize);
    fill(200);
    rect(xCenter, yCenter, cardWidth, cardHeight);

    //testing term
    textAlign(CENTER, CENTER);
    fill(20);
    text(currentCard.testingTerm, xCenter, testCenter);

    //tips
    var tip;
    if (!showAnswers) {
        tip = "click to show answers"
    } else {
        tip = "click to switch card"
    }
    textAlign(CENTER, CENTER);
    fill(100);
    textSize(tipFontSize);
    text(tip, xCenter, tipsCenter);

    //answering term
    textAlign(CENTER, CENTER);
    textSize(altFontSize);
    fill(100, 20, 20);
    if (showAnswers)
        text(currentCard.answerTerm, xCenter, answerCenter);

}
function mousePressed() {
    mouseClick = true;
}

function setup() {
    // setup() runs once. Put your setup code here.
    cardSelect();
    recalibrate();
    createCanvas(windowWidth, windowHeight)
}

function draw() {
    // draw() runs every time before a new frame is rendered. 

    background(20);
    cardMode();
    cardPrint();


    mouseClick = false;

    fill(50)
    rect(16 + 100, 16 + 12, 200, 24)
    fill(0, 160, 160)
    rect(16 + 100 * (completedIndices.length / deck.length), 16 + 12, 200 * (completedIndices.length / deck.length), 24)
    textAlign(LEFT, TOP) // Text alignment of the fps label
    textSize(24)
    text(`${completedIndices.length}/${deck.length}`, 236, 16)

    // Display FPS

    var currentTime = millis()
    frameTimes.push(currentTime)
    while (frameTimes.length > 0 && frameTimes[0] < currentTime - 1000) {
        frameTimes.splice(0, 1)
    }

    fpsCooldown -= currentTime - oldTime
    if (fpsCooldown <= 0) {
        displayFPS = frameTimes.length
        fpsCooldown = 1000
    }

    fill(160)
    textAlign(RIGHT, TOP) // Text alignment of the fps label
    textSize(24)
    text(`${Math.floor(displayFPS)} fps`, width - 16, 16) // Position of the fps label

    oldTime = currentTime
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    recalibrate();
}