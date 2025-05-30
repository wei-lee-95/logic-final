// === Firebase 初始化區段 ===

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase 設定（替換成你自己的）
const firebaseConfig = {
  apiKey: "AIzaSyAI-ltVPViBO-vxCpNmxuMfSXceerVFNwM",
  authDomain: "palace-a538d.firebaseapp.com",
  databaseURL: "https://palace-a538d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "palace-a538d",
  storageBucket: "palace-a538d.firebasestorage.app",
  messagingSenderId: "678950484196",
  appId: "1:678950484196:web:d210cc9991d95b797414f1",    
  measurementId: "G-2NGSGFF69L"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

window.addEventListener('DOMContentLoaded', () => {

  // DOM 元素
  const startBtn = document.getElementById('startBtn');
  const startScreen = document.getElementById('start-screen');
  const storyEl = document.getElementById('story');
  const choicesEl = document.getElementById('choices');
  const endingEl = document.getElementById('ending');
  const restartBtn = document.getElementById('restartBtn');
  const statsEl = document.getElementById('stats');
  const bgm = document.getElementById('bgm');
  const playerNameInput = document.getElementById('player-name');
  const gameWrapper = document.querySelector('.game-wrapper');

  // 🔐 儲存使用者名稱
  let currentUsername = localStorage.getItem('username');

  // 開始遊戲邏輯
  startBtn.addEventListener('click', async () => {
    const name = playerNameInput.value.trim();
    if (!name) return alert("請輸入名號再進入宮門！");
    currentUsername = name;
    localStorage.setItem("username", name);

    bgm.play();

    const userRef = ref(database, `players/${currentUsername}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, { endings: [] });
    }

    startScreen.classList.add('hidden');
    gameWrapper.classList.remove('hidden');
  });

  // 遊戲流程資料
  const scenes = {
    scene1: {
      text: [
        "你踏入紫禁城，感受到濃重的權謀氣息，這裡沒有自由，只有無盡的爭鬥。",
        "但你堅定信念，不是為了苟活，而是為了掌控命運。"
      ],
      choices: [
        { text: "微笑行禮，保持低調", next: "scene2A" },
        { text: "抬頭挺胸，目視眾人", next: "scene2B" }
      ]
    },
    scene2A: {
      text: [
        "你選擇低調行事，暗中觀察宮中紛爭。",
        "偶然間，你跟隨一名神秘太監，發現他手中藏有毒藥。"
      ],
      choices: [
        { text: "告知皇后以求庇護", next: "scene3A" },
        { text: "偷偷破壞毒藥，自己行動", next: "ending1" }
      ]
    },
    scene2B: {
      text: [
        "你當眾表現出強勢氣場，引起皇后和嬪妃的注意。",
        "皇后邀你近前，暗示願意賞識你的才智。"
      ],
      choices: [
        { text: "接受皇后邀請，尋求合作", next: "scene3B" },
        { text: "挑釁嬪妃，試探敵意", next: "ending2" }
      ]
    },
    scene3A: {
      text: [
        "皇后感謝你的忠誠，讓你成為左右手。",
        "然而宮中風險重重，你得選擇是積極行動還是謹慎防守。"
      ],
      choices: [
        { text: "積極擴張勢力", next: "scene4A" },
        { text: "謹慎穩固陣腳", next: "scene4B" }
      ]
    },
    scene3B: {
      text: [
        "你開始參與皇后的計謀，一步步進入權力核心。",
        "但你暗地裡仍懷疑皇后的真正意圖。"
      ],
      choices: [
        { text: "與皇后合作，共同對抗敵人", next: "scene4C" },
        { text: "暗中策劃奪權", next: "scene4D" }
      ]
    },
    scene4A: {
      text: [
        "你大舉招攬盟友，快速擴張勢力。",
        "敵人開始察覺，準備反擊。"
      ],
      choices: [
        { text: "先發制人，發動政變", next: "ending3" },
        { text: "鞏固防守，等待時機", next: "scene5A" }
      ]
    },
    scene4B: {
      text: [
        "你謹慎防守，穩紮穩打。",
        "在暗流中保持生存，等待更好的機會。"
      ],
      choices: [
        { text: "繼續等待突破", next: "scene5B" },
        { text: "突然發動行動", next: "ending4" }
      ]
    },
    scene4C: {
      text: [
        "你和皇后攜手，合力清除敵對勢力。",
        "權力逐漸集中在你們手中。"
      ],
      choices: [
        { text: "成為後宮鐵血霸主", next: "ending5" },
        { text: "與皇后分享權力，和平共治", next: "ending6" }
      ]
    },
    scene4D: {
      text: [
        "你秘密策劃政變，步步逼近目標。",
        "但陰謀終究暴露，你面臨生死考驗。"
      ],
      choices: [
        { text: "孤注一擲，發動政變", next: "ending7" },
        { text: "放棄計劃，隱退宮外", next: "ending8" }
      ]
    },
    scene5A: {
      text: [
        "你穩固陣腳，盟友日增。",
        "後宮爭鬥暫時平息，權勢漸漸達到頂峰。"
      ],
      choices: [
        { text: "享受榮耀與權力", next: "ending9" },
        { text: "繼續謀劃下一步", next: "scene6A" }
      ]
    },
    scene5B: {
      text: [
        "你耐心等待時機，卻意外遭遇敵人暗算。",
        "生命垂危，命運瞬間轉折。"
      ],
      choices: [
        { text: "奮力反擊", next: "ending10" },
        { text: "默默接受命運", next: "ending1" }
      ]
    },
    scene6A: {
      text: [
        "你決定擴大影響力，打破現狀。",
        "新的權力格局即將形成，你即將成為後宮新主宰。"
      ],
      choices: [
        { text: "接受這份榮耀", next: "ending5" },
        { text: "保持低調，暗中掌控", next: "ending6" }
      ]
    },

    // 結局區
    ending1: {
      text: [
        "你在陰謀中被下毒身亡，葬身冷宮，留下無盡遺憾。"
      ]
    },
    ending2: {
      text: [
        "你挑釁嬪妃遭到陷害，失勢出宮，從此沒入塵埃。"
      ]
    },
    ending3: {
      text: [
        "政變失敗，慘遭誅殺，宮廷再無你的身影。"
      ]
    },
    ending4: {
      text: [
        "你突然發動行動，驚退敵人，權勢穩固，前途無量。"
      ]
    },
    ending5: {
      text: [
        "你成為後宮鐵血霸主，權力無人能敵，但也孤獨無比。"
      ]
    },
    ending6: {
      text: [
        "你與皇后和平共治，後宮迎來前所未有的安寧。"
      ]
    },
    ending7: {
      text: [
        "政變暴露，你被囚禁冷宮，悲慘結局不可避免。"
      ]
    },
    ending8: {
      text: [
        "你選擇放棄爭權，隱退江湖，從此遠離風波。"
      ]
    },
    ending9: {
      text: [
        "你掌握權力巔峰，成為後宮真正的主宰。"
      ]
    },
    ending10: {
      text: [
        "你奮力反擊，成功逆轉命運，重回權力中心。"
      ]
    },
  };


  const endingTitles = {
    ending1: "冷宮毒影",
    ending2: "塵埃落定",
    ending3: "謀逆斷首",
    ending4: "黑馬翻盤",
    ending5: "鐵血主宰",
    ending6: "雙后並立",
    ending7: "策反潰敗",
    ending8: "歸隱江湖",
    ending9: "巔峰帝寵",
    ending10: "逆境重生"
  };

  // 顯示場景
  function showScene(sceneKey) {
    const scene = scenes[sceneKey];
    if (!scene) return;
    let textHtml = "";
    scene.text.forEach(paragraph => {
      textHtml += `<p>${paragraph}</p>`;
    });
    storyEl.innerHTML = textHtml;

    choicesEl.innerHTML = "";
    if (scene.choices) {
      scene.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.textContent = choice.text;
        btn.addEventListener('click', () => {
          if (choice.next.startsWith('ending')) {
            saveEndingResult(choice.next);
          } else {
            showScene(choice.next);
          }
        });
        choicesEl.appendChild(btn);
      });
    } 
  }

  // 儲存結局計數
  async function saveEndingResult(endingKey) {
    const userRef = ref(database, `players/${currentUsername}`);
    const snapshot = await get(userRef);
    let endings = [];

    if (snapshot.exists()) {
      endings = snapshot.val().endings || [];
    }

    if (!endings.includes(endingKey)) {
      endings.push(endingKey);
      await set(userRef, { endings });
    }

    showEndingScreen(endingKey, endings.length);
  }

  function showEndingScreen(endingId, count) {
    
    const endingTitle = endingTitles[endingId] || "未知結局";
    storyEl.textContent = `${scenes[endingId].text}`;
    choicesEl.innerHTML = '';
    endingEl.classList.remove('hidden');
    endingEl.innerHTML = `你達成了${endingId}：${endingTitle}`;
    statsEl.innerText = `你目前已解鎖 ${count}/10 個結局`;
    statsEl.classList.remove('hidden');
    restartBtn.classList.remove('hidden');

    if (count >= 10) {
      showAllEndingsUnlocked();
    }
  }

  function showAllEndingsUnlocked(){
    endingEl.innerHTML = `
    <h2 style="color: gold; text-shadow: 0 0 8px #fff700;">🎉 恭喜你達成所有10個結局！🎉</h2>
    <p style="font-size: 1.3rem; margin-top: 20px; color: #b22222;">
      你是宮廷裡最聰慧、最勇敢的小主，無人能敵！<br>
      感謝你陪伴這場風雲變幻的宮廷旅程，願未來再相見。
    </p>
  `;

    statsEl.textContent = "🎖️ 全部結局解鎖完成！超凡成就！";

    // 讓背景閃爍金色（簡單動畫）
    let glow = false;
    const intervalId = setInterval(() => {
      endingEl.style.textShadow = glow ? '0 0 20px gold, 0 0 40px gold' : 'none';
      glow = !glow;
    }, 800);

    // 在重玩時清除動畫
    document.getElementById('restartBtn').onclick = () => {
      clearInterval(intervalId);
    };
  }

  // 重玩按鈕事件
  restartBtn.addEventListener('click', () => {
    endingEl.innerHTML = '';
    statsEl.innerHTML = '';
    endingEl.classList.add('hidden');
    statsEl.classList.add('hidden');
    restartBtn.classList.add('hidden');
    showScene('scene1');
  });


  // 初始化遊戲
  window.onload = () => {
    showScene('scene1');
    bgm.volume = 0.3;  // 音樂音量調整
  };

});