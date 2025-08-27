// backend/scripts/fetchLeetCode.js
import fs from "fs";
import fetch from "node-fetch";

const query = `
  query getProblemset($limit: Int, $skip: Int, $categorySlug: String) {
    problemsetQuestionListV2: problemsetQuestionListV2(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
    ) {
      hasMore
      questions {
        questionFrontendId
        title
        titleSlug
        difficulty
      }
    }
  }
`;

async function fetchQuestions() {
  let allQuestions = [];
  let skip = 0;
  const limit = 50;
  let hasMore = true;

  while (hasMore) {
    console.log(`📡 Fetching questions ${skip + 1} - ${skip + limit}...`);

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0", // ✅ required
      },
      body: JSON.stringify({
        query,
        variables: { categorySlug: "", skip, limit },
      }),
    });

    const data = await response.json();

    if (!data.data || !data.data.problemsetQuestionListV2) {
      console.error("❌ Unexpected response:", JSON.stringify(data, null, 2));
      break;
    }

    const { hasMore: more, questions } = data.data.problemsetQuestionListV2;

    allQuestions.push(...questions);
    skip += limit;
    hasMore = more;
  }

  console.log(`✅ Total questions fetched: ${allQuestions.length}`);

  fs.writeFileSync(
    "leetcode-questions.json",
    JSON.stringify(allQuestions, null, 2),
    "utf-8"
  );

  console.log("💾 Saved to leetcode-questions.json");
}

fetchQuestions().catch((err) => console.error("❌ Error:", err));
