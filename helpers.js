import {Client} from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const getTopics = async () => {
    const response = await notion.blocks.children.list({
        block_id: process.env.PAGE_ID,
        page_size: 50,
    });

    return response.results
        .filter(x => x.type === 'child_page')
        .map(x => x);
}

const createTopic = async (title, content) => {
    return await notion.pages.create({
        parent: {
            type: "page_id",
            page_id: process.env.PAGE_ID
        },
        properties: {
            title: [
                {
                    text: {
                        content: title
                    }
                }
            ]
        },
        children: content.map(x => ({
            object: "block",
            paragraph: {
                rich_text: [
                    {
                        text: {
                            content: x
                        }
                    }
                ]
            }
        }))
    });
}

const addToTopic = async (id, content) => {
    return await notion.blocks.children.append({
        block_id: id,
        children: content.map(x => ({
            object: "block",
            paragraph: {
                rich_text: [
                    {
                        text: {
                            content: x
                        }
                    }
                ]
            }
        }))
    });
}

const getTopicById = async (id) => {
    const response = await notion.blocks.children.list({
        block_id: id
    });
    return response.results;
}

const getUserByApi = async (id) => {
    return fetch(`https://vas3k.club/user/by_telegram_id/${id}.json`, {
        headers: {
            "X-Service-Token": process.env.VAS3K_SERVICE_TOKEN
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Something went wrong');
    });
}

export { getTopics, createTopic, addToTopic, getTopicById, getUserByApi };