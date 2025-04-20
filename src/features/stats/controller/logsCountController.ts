import { NextFunction, Request, Response } from "express";

import esClient from "../../../config/db/elasticsearch";

export const logsCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const indexName = "filebeat-8.17.0-*"; // replace with your index

    const result = await esClient.search({
      index: indexName,
      size: 0, // we don't need actual documents
      aggs: {
        levels: {
          terms: {
            field: "log.level.keyword", // or 'log.level' if not analyzed
          },
        },
      },
    });

    const totalCount = result.hits.total;
    const buckets =
      (
        result.aggregations?.levels as {
          buckets: { key: string; doc_count: number }[];
        }
      ).buckets || [];

    const levelCounts = buckets.reduce((acc: any, bucket: any) => {
      acc[bucket.key] = bucket.doc_count;
      return acc;
    }, {});

    console.log({ result: JSON.stringify(result) });

    res.json({
      count: {
        total: typeof totalCount === "number" ? totalCount : totalCount?.value,
        ...levelCounts,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to count logs" });
  }
};
